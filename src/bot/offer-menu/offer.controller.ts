import { Menu as MenuGrammy } from "@grammyjs/menu";
import { Injectable, SetMetadata } from "@nestjs/common";
import { AppConfigService } from "src/app-config/app-config.service";
import { Offers } from "src/mikroorm/entities/Offers";
import { BaseMenu, BotContext, BotStep, PM } from "src/types/interfaces";
import { Menu, MenuController } from "../common/decorators";
import { label } from "../common/helpers";
import { accountKeyboard, arbitraryKeyboard, mainKeyboard, offerKeyboard } from "../common/keyboards";
import { offerService } from './offer.service'
import { AppEventsController } from '../../app-events/app-events.controller';

@MenuController
export class offerController extends BaseMenu {
  constructor(
    private readonly offerService: offerService,
    private readonly configService: AppConfigService,
  ) {
    super()

  }
  @Menu('offer-menu')
  menu = new MenuGrammy<BotContext>("offer-menu")
    .dynamic((ctx, range) => {
      switch (ctx.session.step) {
        case BotStep.rules: {
          range.text(label({ text: 'acceptRules' }), async (ctx) => {
            await this.offerService.acceptRules(ctx)
            ctx.session.step = BotStep.roles
            ctx.editMessageText(ctx.i18n.t('askRole'))
            ctx.menu.update()
          })
          range.text(label({ text: 'rejectRules' }), async (ctx) => {
            await ctx.deleteMessage()
            await ctx.reply(ctx.i18n.t('start'), { reply_markup: mainKeyboard(ctx) })
          })
          range.text(label({ text: 'getRules' }), ctx => ctx.reply(ctx.i18n.t('rulesContent')))
          break;
        }
        case BotStep.roles: {
          range.text(label({ text: 'buyer' }), ctx => {
            ctx.editMessageText(ctx.i18n.t('askContact'))
            ctx.session.step = BotStep.contact
            ctx.menu.update()
          })
          range.text(label({ text: 'seller' }), ctx => {
            ctx.editMessageText(ctx.i18n.t('askContact'))
            ctx.session.step = BotStep.contact
            ctx.menu.update()
          })
          break
        }
        case BotStep.contact: {
          range.text(label({ text: 'back' }), ctx => {
            ctx.editMessageText(ctx.i18n.t('askRole'))
            ctx.session.step = BotStep.roles
            ctx.menu.update()
          })
          break
        }
        case BotStep.fee: {
          range.text(label({ text: 'buyer' }), ctx => {
            ctx.editMessageText(ctx.i18n.t('askPaymentMethod'))
            ctx.session.step = BotStep.payment
            ctx.menu.update()
          })
          range.text(label({ text: 'seller' }), ctx => {
            ctx.editMessageText(ctx.i18n.t('askPaymentMethod'))
            ctx.session.step = BotStep.payment
            ctx.menu.update()
          })
          break
        }
        case BotStep.payment: {
          const pms = this.configService.payments
          pms.map(pm => range.text({ text: ctx.i18n.t(pm.method) || pm.method, payload: String(pm.id) }, async ctx => {
            ctx.session.step = BotStep.value
            ctx.session.pendingOffer.paymentMethodId = Number(ctx.match)
            ctx.editMessageText(ctx.i18n.t('askOfferValue'))
            ctx.menu.update()
          }))
          break
        }
        case BotStep.value: {
          range.text(label({ text: 'back' }), ctx => {
            ctx.editMessageText(ctx.i18n.t('askPaymentMethod'))
            ctx.session.step = BotStep.payment
            ctx.menu.update()
          })
          break
        }
        case BotStep.shipping: {
          range.text(label({ text: 'back' }), ctx => {
            ctx.editMessageText(ctx.i18n.t('askOfferValue'))
            ctx.session.step = BotStep.value
            ctx.menu.update()
          })
          break
        }
        case BotStep.productDetails: {
          range.text(label({ text: 'back' }), ctx => {
            ctx.editMessageText(ctx.i18n.t('askEstimatedShipping'))
            ctx.session.step = BotStep.shipping
            ctx.menu.update()
          })
          break
        }
        case BotStep.shippingDetails: {
          range.text(label({ text: 'back' }), ctx => {
            ctx.editMessageText(ctx.i18n.t('askProductDetails'))
            ctx.session.step = BotStep.productDetails
            ctx.menu.update()
          })
          break
        }
        case BotStep.productRest: {
          range.text(label({ text: 'back' }), ctx => {
            ctx.editMessageText(ctx.i18n.t('askShippingDetails'))
            ctx.session.step = BotStep.shippingDetails
            ctx.menu.update()
          })
          break
        }
        case BotStep.rest: {
          range.text(label({ text: 'back' }), ctx => {
            ctx.editMessageText(ctx.i18n.t('askProductAdditionalDetails'))
            ctx.session.step = BotStep.productRest
            ctx.menu.update()
          })
          break
        }
        case BotStep.refund: {
          range.text(label({ text: 'back' }), ctx => {
            ctx.editMessageText(ctx.i18n.t('askRestDetails'))
            ctx.session.step = BotStep.rest
            ctx.menu.update()
          })
          break
        }
      }
      return range
    })
    .row()

}