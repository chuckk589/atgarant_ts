
import { AppConfigService } from "src/app-config/app-config.service";
import { Offers, OffersFeePayer, OffersRole } from "src/mikroorm/entities/Offers";
import { BaseComposer, BotContext, BotStep, callbackQuery, OfferCallbackData, OfferMode } from "src/types/interfaces";
import { Command, ComposerController, Hears, On, Use, } from "../common/decorators";
import { accountKeyboard, arbitraryKeyboard, mainKeyboard, offerKeyboard } from "../common/keyboards";
import { offerController } from "../offer-menu/offer.controller";
import { globalService } from './global.service'
import { AppEventsController } from '../../app-events/app-events.controller';
import { Inject, forwardRef } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { getOffersMessage } from "../common/helpers";
import { OfferEditMenuController } from 'src/bot/offer-edit-menu/offer-edit-menu.controller'

@ComposerController
export class globalComposer extends BaseComposer {
  constructor(
    private readonly globalService: globalService,
    private readonly AppConfigService: AppConfigService,
    private readonly offerController: offerController,
    private readonly OfferEditMenuController: OfferEditMenuController,
    //@Inject('TEST') private readonly a: any,
    //@Inject(AppEventsController) private readonly AppEventsController: AppEventsController
    private readonly AppEventsController: AppEventsController,
    @InjectPinoLogger('globalComposer') private readonly logger: PinoLogger

  ) {
    super()
  }
  mode: string = this.AppConfigService.get<string>('node_env', { infer: true });
  url: string = this.AppConfigService.get<string>('url', { infer: true })

  @Use()
  menu = this.offerController.getMenu()

  @Use()
  menu1 = this.OfferEditMenuController.getMenu()

  @Command('start')
  start: Function = async (ctx: BotContext) => {
    const user = await this.globalService.fetchUser(ctx)
    ctx.i18n.locale(user.locale)
    ctx.session.step = BotStep.default
    ctx.session.user.acceptedRules = user.acceptedRules
    await ctx.reply(ctx.i18n.t('start'), { reply_markup: mainKeyboard(ctx) })
  }
  //* OFFERS BLOCK
  @Hears('offers')
  offers: Function = async (ctx: BotContext) => {
    const imageurl = this.mode == 'development' ? 'https://picsum.photos/200/300' : this.url + '/media/04.jpg';
    await ctx.replyWithPhoto(imageurl, { caption: ctx.i18n.t('offerMenu'), reply_markup: offerKeyboard(ctx) })
  }
  @Hears('createOffer')
  createOffer: Function = async (ctx: BotContext) => {
    // ! uncomment required
    ctx.session.step = BotStep.refund
    ctx.session.pendingOffer = {
      feePayer: OffersFeePayer.BUYER,
      role: OffersRole.SELLER,
      paymentMethodId: 1,
      offerValue: 1111,
      feeBaked: 111.1,
      sellerWalletData: '',
      offerStatus: 'На согласовании',
      estimatedShipping: new Date(),
      productDetails: '2',
      shippingDetails: '22',
      productAdditionalDetails: '33',
      restDetails: '22',
      refundDetails: '11',
      initiator_chatId: '517717745',
      partner_chatId: '517717745'
    }
    //ctx.session.step = ctx.session.user.acceptedRules ? BotStep.roles : BotStep.rules

    const message = ctx.session.user.acceptedRules ? ctx.i18n.t('askRole') : ctx.i18n.t('offerWarning')
    await ctx.reply(message, { reply_markup: this.offerController.getMenu() })
  }
  //* OFFERS BLOCK
  @Hears('arbitraries')
  arbitraries: Function = async (ctx: BotContext) => {
    const imageurl = this.mode == 'development' ? 'https://picsum.photos/200/300' : this.url + '/media/03.jpg';
    await ctx.replyWithPhoto(imageurl, { caption: ctx.i18n.t('arbitraries'), reply_markup: arbitraryKeyboard(ctx) })
  }

  @Hears('account')
  account: Function = async (ctx: BotContext) => {
    await ctx.reply(ctx.i18n.t('account'), { reply_markup: accountKeyboard(ctx) })
  }

  @Hears('rules')
  rules: Function = async (ctx: BotContext) => await ctx.reply(ctx.i18n.t('rules'))

  @Hears('instructions')
  instructions: Function = async (ctx: BotContext) => await ctx.reply(ctx.i18n.t('instructions'))

  @Hears('info')
  info: Function = async (ctx: BotContext) => await ctx.reply(ctx.i18n.t('info'))

  @Hears('allOffers')
  allOffers = async (ctx: BotContext) => {
    const offers = await this.globalService.fetchOffers(ctx.from.id)
    if (offers.length) {
      await ctx.reply(ctx.i18n.t('offerHistory') + getOffersMessage(offers, ctx.from.id))
      ctx.session.step = BotStep.offer
    } else {
      await ctx.reply(ctx.i18n.t('noData'))
    }
  }

  @On("callback_query:data")
  callbackHandler = async (ctx: BotContext) => {
    const data = new OfferCallbackData(ctx.update.callback_query.data)
    //accept button click
    if (data.action == 'admit') {
      //accept button clicked right after offer creation by initiator 
      if (data.mode == OfferMode.default) {
        await ctx.deleteMessage()
        const offer = await this.globalService.createOffer(ctx)
        await this.AppEventsController.offerCreated<Offers>(offer, String(ctx.from.id))
      }
      //accept button clicked after receiving an offer and NOT editing it
      else if (data.mode == OfferMode.edit) {
        await ctx.deleteMessage()
        await this.AppEventsController.offerAccepted(data.payload)
      }
      await ctx.reply(ctx.i18n.t('offerCreated'))
    }
    else if (data.action == 'edit') {
      //edit button clicked right after offer creation by initiator 
      if (data.mode == OfferMode.default) {
        ctx.session.step = BotStep.roles
        await ctx.reply(ctx.i18n.t('askRole'), { reply_markup: this.offerController.getMenu() })
      }
      //edit button clicked after receiving an offer
      //need to write offer into receiving end session
      else if (data.mode == OfferMode.edit) {
        await ctx.deleteMessage()
        await this.AppEventsController.offerEditInitiated(data.payload, ctx)
      }
    }
    else if (data.action == 'reject') {
      if (data.mode == OfferMode.default) {
        ctx.session.step = BotStep.default
        await ctx.deleteMessage()
        await ctx.reply(ctx.i18n.t('start'), { reply_markup: mainKeyboard(ctx) })
      } else if (data.mode == OfferMode.edit) {
        await ctx.deleteMessage()
        await this.AppEventsController.offerRejectInitiated(data.payload, ctx)
      }
    }

  }
}