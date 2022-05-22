import { Controller, forwardRef, Inject, Injectable } from '@nestjs/common';
import { BaseMenu, BotContext, BotStep } from 'src/types/interfaces';
import { Menu, MenuController } from '../common/decorators';
import { Menu as MenuGrammy } from '@grammyjs/menu';
import { OfferEditMenuService } from './offer-edit-menu.service';
import { AppConfigService } from 'src/app-config/app-config.service';
import { checkoutMessage, isInitiator, isSeller, leftReview } from 'src/bot/common/helpers';
import { AppEventsController } from 'src/app-events/app-events.controller';
import { Offers } from 'src/mikroorm/entities/Offers';
import { feedbackMenu } from '../common/keyboards';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { botOfferDto } from 'src/mikroorm/dto/create-offer.dto';

@MenuController
export class OfferEditMenuController extends BaseMenu {
  constructor(
    private readonly AppEventsController: AppEventsController,
    private readonly AppConfigService: AppConfigService,
    @InjectPinoLogger('OfferEditMenuController') private readonly logger: PinoLogger,
  ) {
    super();
  }
  @Menu('offer-edit-menu')
  menu = new MenuGrammy<BotContext>('offer-edit-menu')
    .dynamic((ctx, range) => {
      const status = ctx.session.editedOffer.offerStatus;
      const _isSeller = isSeller(ctx);
      const _canLeaveReview = leftReview(ctx.session.editedOffer.reviews, ctx.from.id);
      if (status.value == 'denied') return range;
      status.value !== 'closed' &&
        range.text(ctx.i18n.t('setWallet'), async (ctx) => {
          ctx.session.step = BotStep.setWallet;
          await ctx.reply(ctx.i18n.t('askWallet'));
        });
      status.value === 'payed' &&
        _isSeller &&
        range.text(ctx.i18n.t('confirmShipping'), async (ctx) => {
          try {
            ctx.session.editedOffer.offerStatus = await this.AppEventsController.offerShipped<Offers>(
              ctx.session.editedOffer,
            );
            await ctx.editMessageText(checkoutMessage(new botOfferDto(ctx.session.editedOffer), ctx.i18n.locale()));
          } catch (error) {
            this.logger.error(error);
            ctx.reply(ctx.i18n.t('offerShippingFailed'));
          }
        });
      status.value === 'arrived' &&
        _isSeller &&
        ctx.session.editedOffer.sellerWalletData &&
        range.text(ctx.i18n.t('getPayout'), async (ctx) => {
          try {
            ctx.session.editedOffer.offerStatus = await this.AppEventsController.offerPaymentRequested<Offers>(
              ctx.session.editedOffer,
            );
            await ctx.editMessageText(checkoutMessage(new botOfferDto(ctx.session.editedOffer), ctx.i18n.locale()));
            //ctx.menu.update()
          } catch (error) {
            this.logger.error(error);
            ctx.reply(ctx.i18n.t('paymentRequestFailed'));
          }
        });
      status.value === 'shipped' &&
        !_isSeller &&
        range.text(ctx.i18n.t('confirmArrival'), async (ctx) => {
          try {
            ctx.session.editedOffer.offerStatus = await this.AppEventsController.offerArrived<Offers>(
              ctx.session.editedOffer,
            );
            await ctx.editMessageText(checkoutMessage(new botOfferDto(ctx.session.editedOffer), ctx.i18n.locale()));
            //ctx.reply(ctx.i18n.t('dataUpdated'))
          } catch (error) {
            this.logger.error(error);
            ctx.reply(ctx.i18n.t('arrivalFailed'));
          }
        });
      status.value !== 'closed' &&
        status.value !== 'arbitrary' &&
        status.value !== 'pending' &&
        range.text(ctx.i18n.t('openArbitrary'), async (ctx) => {
          ctx.session.step = BotStep.setArbitrary;
          ctx.reply(ctx.i18n.t('askArbitraryReason'));
        });
      status.value === 'closed' &&
        _canLeaveReview &&
        range.text(ctx.i18n.t('leaveFeedback'), async (ctx) => {
          await ctx.reply(ctx.i18n.t('feedbackGroup'), {
            reply_markup: feedbackMenu(ctx.session.editedOffer.id, ctx.i18n.locale()),
          });
        });
      return range;
    })
    .row();
}
