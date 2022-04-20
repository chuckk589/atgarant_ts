import { Router } from "@grammyjs/router";
import { BaseComposer, BaseRouter, BotContext, BotStep, OfferMode } from "src/types/interfaces";
import { RouterController, Use } from "../common/decorators";
import { routerService } from './router.service'
import { offerController } from '../offer/offer.controller'
import { AppConfigService } from "src/app-config/app-config.controller";
import { DateTime } from 'luxon'
import { Controller, Inject, Injectable } from "@nestjs/common";
import { Bot } from "grammy";
import { BOT_NAME } from "src/constants";
import { AppEventsController } from "../../app-events/app-events.controller";
import { Offers } from "src/mikroorm/entities/Offers";
import { botOfferDto } from "src/mikroorm/dto/create-offer.dto";
import { manageOfferMenu } from "../common/keyboards";

@Injectable()
@RouterController
export class routerController extends BaseRouter {
  constructor(

    private readonly routerService: routerService,
    private readonly offerController: offerController,
    private readonly AppConfigService: AppConfigService,
    private readonly AppEventsController: AppEventsController,
  ) {
    super()

  }

  @Use()
  router = new Router<BotContext>((ctx) => ctx.session.step)
    .route(BotStep.contact, async ctx => {
      const user = await this.routerService.fetchContact(ctx)
      if (user) {
        if (user.chatId == String(ctx.from.id)) {
          await ctx.reply(ctx.i18n.t('cannotAddSelfError'))
        } else {
          ctx.session.step = BotStep.fee
          ctx.session.pendingOffer.partner_chatId = user.chatId
          await ctx.reply(ctx.i18n.t('askFeePayer'), { reply_markup: this.offerController.getMenu() })
        }
      } else {
        await ctx.reply(ctx.i18n.t('userNotFound', { user: ctx.message.text }))
      }
    })
    .route(BotStep.value, async ctx => {
      const paymentMethod = this.AppConfigService.payments.find(p => p.id == Number(ctx.session.pendingOffer.paymentMethodId))
      const value = Number(ctx.message.text)
      if (value && value > paymentMethod.minSum && value < paymentMethod.maxSum) {
        ctx.session.pendingOffer.offerValue = value
        ctx.session.pendingOffer.feeBaked = Math.max(value * paymentMethod.feePercent / 100, paymentMethod.feeRaw)
        ctx.session.step = BotStep.shipping
        await ctx.reply(ctx.i18n.t('askEstimatedShipping'), { reply_markup: this.offerController.getMenu() })
      } else {
        ctx.reply(ctx.i18n.t('wrongDataOfferValue', { minSum: paymentMethod.minSum, maxSum: paymentMethod.maxSum }))
      }
    })
    .route(BotStep.shipping, async ctx => {
      const date = DateTime.fromFormat(ctx.message.text, 'MM.dd.yyyy')
      if (date.isValid) {
        ctx.session.pendingOffer.estimatedShipping = date.toJSDate()
        ctx.session.step = BotStep.productDetails
        await ctx.reply(ctx.i18n.t('askProductDetails'), { reply_markup: this.offerController.getMenu() })
      } else {
        await ctx.reply(ctx.i18n.t('wrongData'))
      }
    })
    .route(BotStep.productDetails, async ctx => {
      ctx.session.pendingOffer.productDetails = ctx.message.text
      ctx.session.step = BotStep.shippingDetails
      await ctx.reply(ctx.i18n.t('askShippingDetails'), { reply_markup: this.offerController.getMenu() })
    })
    .route(BotStep.shippingDetails, async ctx => {
      ctx.session.pendingOffer.shippingDetails = ctx.message.text
      ctx.session.step = BotStep.productRest
      await ctx.reply(ctx.i18n.t('askProductAdditionalDetails'), { reply_markup: this.offerController.getMenu() })
    })
    .route(BotStep.productRest, async ctx => {
      ctx.session.pendingOffer.productAdditionalDetails = ctx.message.text
      ctx.session.step = BotStep.rest
      await ctx.reply(ctx.i18n.t('askRestDetails'), { reply_markup: this.offerController.getMenu() })
    })
    .route(BotStep.rest, async ctx => {
      ctx.session.pendingOffer.restDetails = ctx.message.text
      ctx.session.step = BotStep.refund
      await ctx.reply(ctx.i18n.t('askProductRefundTime'), { reply_markup: this.offerController.getMenu() })
    })
    .route(BotStep.refund, async ctx => {
      ctx.session.pendingOffer.refundDetails = ctx.message.text
      ctx.session.pendingOffer.initiator_chatId = String(ctx.from.id)
      ctx.session.step = BotStep.checkout
      await ctx.reply(this.AppEventsController.checkoutMessage(ctx.session.pendingOffer, ctx.i18n.locale()), { reply_markup: manageOfferMenu(0, ctx.i18n.locale(), OfferMode.default) })
    })
    .otherwise(ctx => { console.log('otherwise') })

}