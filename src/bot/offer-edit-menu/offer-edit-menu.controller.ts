import { Controller, forwardRef, Inject, Injectable } from '@nestjs/common';
import { BaseMenu, BotContext, BotStep } from 'src/types/interfaces';
import { Menu, MenuController } from '../common/decorators';
import { Menu as MenuGrammy } from "@grammyjs/menu";
import { OfferEditMenuService } from './offer-edit-menu.service';
import { AppConfigService } from "src/app-config/app-config.service";
import { isInitiator, isSeller, leftReview } from 'src/bot/common/helpers'
import { AppEventsController } from "src/app-events/app-events.controller";
import { Offers } from 'src/mikroorm/entities/Offers';
import { feedbackMenu } from '../common/keyboards';

@MenuController
export class OfferEditMenuController extends BaseMenu {
  constructor(
    private readonly AppEventsController: AppEventsController,
  ) {
    super()
  }
  @Menu('offer-edit-menu')
  menu = new MenuGrammy<BotContext>("offer-edit-menu")
    .dynamic((ctx, range) => {
      const status = ctx.session.editedOffer.offerStatus
      const _isSeller = isSeller(ctx)
      const _canLeaveReview = leftReview(ctx.session.editedOffer.reviews, ctx.from.id)
      range.text(ctx.i18n.t('setWallet'), async (ctx) => {
        ctx.session.step = BotStep.setWallet
        await ctx.reply(ctx.i18n.t('askWallet'))
      })
      status.value === 'payed' && _isSeller && range.text(ctx.i18n.t('confirmShipping'), async (ctx) => {
        ctx.session.editedOffer.offerStatus = await this.AppEventsController.offerShipped<Offers>(ctx.session.editedOffer)
        ctx.menu.update()
        ctx.reply(ctx.i18n.t('dataUpdated'))
      })//
      status.value === 'arrived' && _isSeller && ctx.session.pendingOffer.sellerWalletData && range.text(ctx.i18n.t('getPayout'), async (ctx) => {
        ctx.session.editedOffer.offerStatus = await this.AppEventsController.offerPaymentRequested<Offers>(ctx.session.editedOffer)
        ctx.menu.update()
        ctx.reply(ctx.i18n.t('sellerOfferPaymentRequested'))
      })//
      status.value === 'shipped' && !_isSeller && ctx.session.pendingOffer.sellerWalletData && range.text(ctx.i18n.t('confirmArrival'), async (ctx) => {
        ctx.session.editedOffer.offerStatus = await this.AppEventsController.offerArrived<Offers>(ctx.session.editedOffer)
        ctx.menu.update()
        ctx.reply(ctx.i18n.t('dataUpdated'))
      })//
      status.value !== 'closed' && status.value !== 'arbitrary' && status.value !== 'pending' && range.text(ctx.i18n.t('openArbitrary'), async (ctx) => {
        ctx.session.step = BotStep.setArbitrary
        ctx.reply(ctx.i18n.t('askArbitraryReason'))
      })
      status.value === 'closed' && _canLeaveReview && range.text(ctx.i18n.t('leaveFeedback'), async (ctx) => {
        await ctx.reply(ctx.i18n.t('feedbackGroup'), { reply_markup: feedbackMenu(ctx.session.editedOffer.id, ctx.i18n.locale()) })
      })
      return range
    })
    .row()
}