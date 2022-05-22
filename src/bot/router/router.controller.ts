import { Router } from '@grammyjs/router';
import { BaseComposer, BaseRouter, BotContext, BotStep } from 'src/types/interfaces';
import { RouterController, Use } from '../common/decorators';
import { routerService } from './router.service';
import { offerController } from '../offer-menu/offer.controller';
import { AppConfigService } from 'src/app-config/app-config.service';
import { DateTime } from 'luxon';
import { Catch, Controller, Inject, Injectable } from '@nestjs/common';
import { Bot } from 'grammy';
import { BOT_NAME } from 'src/constants';
import { AppEventsController } from '../../app-events/app-events.controller';
import { Offers } from 'src/mikroorm/entities/Offers';
import { botOfferDto } from 'src/mikroorm/dto/create-offer.dto';
import { manageOfferMenu } from '../common/keyboards';
import { checkoutArbMessage, checkoutMessage } from '../common/helpers';
import { OfferEditMenuController } from 'src/bot/offer-edit-menu/offer-edit-menu.controller';
import { ReviewsRate } from 'src/mikroorm/entities/Reviews';
import { ArbEditMenuController } from 'src/bot/arb-edit-menu/arb-edit-menu.controller';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

//TODO:  Route decorator
@Injectable()
@RouterController
export class routerController extends BaseRouter {
  constructor(
    private readonly routerService: routerService,
    private readonly offerController: offerController,
    private readonly OfferEditMenuController: OfferEditMenuController,
    private readonly ArbEditMenuController: ArbEditMenuController,
    private readonly AppConfigService: AppConfigService,
    private readonly AppEventsController: AppEventsController,
    @InjectPinoLogger('routerController') private readonly logger: PinoLogger,
  ) {
    super();
  }

  @Use()
  router = new Router<BotContext>((ctx) => ctx.session.step)
    .route(BotStep.contact, async (ctx) => {
      const user = await this.routerService.fetchContact(ctx);
      if (user) {
        if (user.chatId == String(ctx.from.id)) {
          await ctx.reply(ctx.i18n.t('cannotAddSelfError'));
        } else {
          ctx.session.step = BotStep.fee;
          ctx.session.pendingOffer.partner_chatId = user.chatId;
          await ctx.cleanReplySave(ctx.i18n.t('askFeePayer'), { reply_markup: this.offerController.getMiddleware() });
        }
      } else {
        await ctx.reply(ctx.i18n.t('userNotFound', { user: ctx.message.text }));
      }
    })
    .route(BotStep.value, async (ctx) => {
      const paymentMethod = this.AppConfigService.payments.find(
        (p) => p.id == Number(ctx.session.pendingOffer.paymentMethodId),
      );
      const value = Number(ctx.message.text);
      if (value && value > paymentMethod.minSum && value < paymentMethod.maxSum) {
        ctx.session.pendingOffer.offerValue = value;
        ctx.session.pendingOffer.feeBaked = Math.max((value * paymentMethod.feePercent) / 100, paymentMethod.feeRaw);
        ctx.session.step = BotStep.shipping;
        await ctx.cleanReplySave(ctx.i18n.t('askEstimatedShipping'), {
          reply_markup: this.offerController.getMiddleware(),
        });
      } else {
        ctx.reply(ctx.i18n.t('wrongDataOfferValue', { minSum: paymentMethod.minSum, maxSum: paymentMethod.maxSum }));
      }
    })
    .route(BotStep.shipping, async (ctx) => {
      const date = DateTime.fromFormat(ctx.message.text, 'MM.dd.yyyy');
      if (date.isValid) {
        ctx.session.pendingOffer.estimatedShipping = date.toJSDate();
        ctx.session.step = BotStep.productDetails;
        await ctx.cleanReplySave(ctx.i18n.t('askProductDetails'), {
          reply_markup: this.offerController.getMiddleware(),
        });
      } else {
        await ctx.reply(ctx.i18n.t('wrongData'));
      }
    })
    .route(BotStep.productDetails, async (ctx) => {
      ctx.session.pendingOffer.productDetails = ctx.message.text;
      ctx.session.step = BotStep.shippingDetails;
      await ctx.cleanReplySave(ctx.i18n.t('askShippingDetails'), {
        reply_markup: this.offerController.getMiddleware(),
      });
    })
    .route(BotStep.shippingDetails, async (ctx) => {
      ctx.session.pendingOffer.shippingDetails = ctx.message.text;
      ctx.session.step = BotStep.productRest;
      await ctx.cleanReplySave(ctx.i18n.t('askProductAdditionalDetails'), {
        reply_markup: this.offerController.getMiddleware(),
      });
    })
    .route(BotStep.productRest, async (ctx) => {
      ctx.session.pendingOffer.productAdditionalDetails = ctx.message.text;
      ctx.session.step = BotStep.rest;
      await ctx.cleanReplySave(ctx.i18n.t('askRestDetails'), { reply_markup: this.offerController.getMiddleware() });
    })
    .route(BotStep.rest, async (ctx) => {
      ctx.session.pendingOffer.restDetails = ctx.message.text;
      ctx.session.step = BotStep.refund;
      await ctx.cleanReplySave(ctx.i18n.t('askProductRefundTime'), {
        reply_markup: this.offerController.getMiddleware(),
      });
    })
    .route(BotStep.refund, async (ctx) => {
      ctx.session.pendingOffer.refundDetails = ctx.message.text;
      ctx.session.pendingOffer.initiator_chatId = String(ctx.from.id);
      ctx.session.step = BotStep.checkout;
      await ctx.cleanReplySave(checkoutMessage(ctx.session.pendingOffer, ctx.i18n.locale()), {
        reply_markup: manageOfferMenu(0, ctx.i18n.locale(), 'default'),
      });
    })
    .route(BotStep.offer, async (ctx) => {
      if (ctx.message && ctx.message.text && Number(ctx.message.text)) {
        const offer = await this.routerService.fetchOffer(Number(ctx.message.text), ctx.from.id);
        if (!offer) return;
        ctx.session.editedOffer = offer;
        await ctx.cleanReplySave(checkoutMessage(new botOfferDto(offer), ctx.i18n.locale()), {
          reply_markup: this.OfferEditMenuController.getMiddleware(),
        });
      }
    })
    .route(BotStep.setWallet, async (ctx) => {
      ctx.session.step = BotStep.offer;
      await this.routerService.setWallet(ctx);
      await ctx.reply(ctx.i18n.t('dataUpdated'));
      await ctx.cleanReplySave(checkoutMessage(new botOfferDto(ctx.session.editedOffer), ctx.i18n.locale()), {
        reply_markup: this.OfferEditMenuController.getMiddleware(),
      });
    })
    .route(BotStep.setArbitrary, async (ctx) => {
      try {
        ctx.session.editedOffer.offerStatus = await this.AppEventsController.arbOpened<Offers>(
          ctx.session.editedOffer,
          ctx.message.text,
          ctx.from.id,
        );
        ctx.session.step = BotStep.offer;
        await ctx.cleanReplySave(checkoutMessage(new botOfferDto(ctx.session.editedOffer), ctx.i18n.locale()), {
          reply_markup: this.OfferEditMenuController.getMiddleware(),
        });
      } catch (error) {
        this.logger.error(error);
        await ctx.reply(ctx.i18n.t(error.message));
      }
    })
    .route(BotStep.setFeedbackN || BotStep.setFeedbackP, async (ctx) => {
      try {
        const rate = ctx.session.step == BotStep.setFeedbackN ? ReviewsRate.NEGATIVE : ReviewsRate.POSITIVE;
        ctx.session.step = BotStep.offer;
        await this.AppEventsController.offerFeedback<Offers>(
          ctx.session.editedOffer,
          ctx.message.text,
          ctx.from.id,
          rate,
        );
        await ctx.reply(ctx.i18n.t('feedbackLeft'));
      } catch (error) {
        this.logger.error(error);
        await ctx.reply(ctx.i18n.t('feedbackFailed'));
      }
    })
    .route(BotStep.arbitrary, async (ctx) => {
      if (ctx.message && ctx.message.text && Number(ctx.message.text)) {
        const arb = await this.routerService.fetchArb(Number(ctx.message.text), ctx.from.id);
        if (!arb) return;
        ctx.session.editedArb = arb;
        await ctx.cleanReplySave(checkoutArbMessage(arb, ctx.i18n.locale()), {
          reply_markup: this.ArbEditMenuController.getMiddleware(),
        });
      }
    })
    .otherwise((ctx) => {
      ctx.clean();
    });
}
