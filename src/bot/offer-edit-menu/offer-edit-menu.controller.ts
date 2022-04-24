import { Controller } from '@nestjs/common';
import { BaseMenu, BotContext, BotStep } from 'src/types/interfaces';
import { Menu, MenuController } from '../common/decorators';
import { Menu as MenuGrammy } from "@grammyjs/menu";
import { OfferEditMenuService } from './offer-edit-menu.service';
import { AppConfigService } from "src/app-config/app-config.service";
import { isInitiator, isSeller } from 'src/bot/common/helpers'

@MenuController
export class OfferEditMenuController extends BaseMenu {
  constructor(
    private readonly offerEditMenuService: OfferEditMenuService,
    private readonly AppConfigService: AppConfigService
  ) {
    super()
  }
  @Menu('offer-edit-menu')
  menu = new MenuGrammy<BotContext>("offer-edit-menu")
    .dynamic((ctx, range) => {
      const status = this.AppConfigService.offerStatus<string>(ctx.session.pendingOffer.offerStatus)
      const _isInitiator = isInitiator(ctx)
      const _isSeller = isSeller(ctx)
      range.text(ctx.i18n.t('setWallet'), async (ctx) => {
        ctx.session.step = BotStep.setWallet
        await ctx.reply(ctx.i18n.t('askWallet'))
      })
      status.value === 'pending' && _isInitiator && range.text(ctx.i18n.t('sendOffer'), async (ctx) => {
        ctx.reply(ctx.i18n.t('dataUpdated'))
      })//
      status.value === 'payed' && _isSeller && range.text(ctx.i18n.t('confirmShipping'), async (ctx) => {
        ctx.reply(ctx.i18n.t('dataUpdated'))
      })//
      status.value === 'arrived' && _isSeller && ctx.session.pendingOffer.sellerWalletData && range.text(ctx.i18n.t('getPayout'), async (ctx) => {
        ctx.reply(ctx.i18n.t('dataUpdated'))
      })//
      status.value === 'shipped' && !_isSeller && ctx.session.pendingOffer.sellerWalletData && range.text(ctx.i18n.t('confirmArrival'), async (ctx) => {
        ctx.reply(ctx.i18n.t('dataUpdated'))
      })//
      status.value !== 'closed' && status.value !== 'arbitrary' && status.value !== 'pending' && range.text(ctx.i18n.t('openArbitrary'), async (ctx) => {
        ctx.session.step = BotStep.setArbitrary
        ctx.reply(ctx.i18n.t('askArbitraryReason'))
      })
      status.value === 'closed' && range.text(ctx.i18n.t('leaveFeedback'), async (ctx) => {
        ctx.session.step = BotStep.setFeedback
        // if (!ctx.wizard.state.currentOffer.reviews.length) {
        //   ctx.reply(ctx.i18n.t('feedbackGroup'), markups.feedbackGroup(ctx)).then(r => ctx.session.menuId = r.message_id)
        //   return ctx.wizard.next();
        // } else {
        //   return ctx.reply(ctx.i18n.t('feedbackExists'))
        // }
      })
    })
}