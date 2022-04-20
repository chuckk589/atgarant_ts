
import { AppConfigService } from "src/app-config/app-config.controller";
import { OffersFeePayer, OffersRole } from "src/mikroorm/entities/Offers";
import { BaseComposer, BotContext, BotStep, callbackQuery, OfferCallbackData, OfferMode } from "src/types/interfaces";
import { Command, ComposerController, Hears, On, Use, } from "../common/decorators";
import { accountKeyboard, arbitraryKeyboard, mainKeyboard, offerKeyboard } from "../common/keyboards";
import { offerController } from "../offer/offer.controller";
import { globalService } from './global.service'
import { AppEventsController } from '../../app-events/app-events.controller';
import { Inject, forwardRef } from "@nestjs/common";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

@ComposerController
export class globalComposer extends BaseComposer {
  constructor(
    private readonly globalService: globalService,
    private readonly AppConfigService: AppConfigService,
    private readonly offerController: offerController,
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

  @Command('start')
  start: Function = async (ctx: BotContext) => {
    const user = await this.globalService.fetchUser(ctx)
    ctx.i18n.locale(user.locale)
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

  @On("callback_query:data")
  callbackHandler = async (ctx: BotContext) => {
    const data = new OfferCallbackData(ctx.update.callback_query.data)
    console.log(data)
    //accept button click
    if (data.action == 'admit') {
      //accept button clicked right after offer creation by initiator process
      if (data.mode == OfferMode.default) {
        ctx.deleteMessage()
        const offer = await this.globalService.createOffer(ctx)
        this.AppEventsController.offerCreated(offer, String(ctx.from.id))
        await ctx.reply(ctx.i18n.t('offerCreated'))
      }
      //accept button clicked after receiving an offer and NOT editing it
      else if (data.mode == OfferMode.edit) {
        ctx.deleteMessage()
        this.AppEventsController.offerAccepted(data.payload, String(ctx.from.id))
        await ctx.reply(ctx.i18n.t('offerCreated'))
      }
    }

  }
}
// await cleanUp(ctx)
// await ctx.deleteMessage(ctx.update.callback_query.message.message_id).catch(() => { })
// const offerId = ctx.update.callback_query.data.split('_').pop()
// const offerData = await fetchOfferDetails(offerId)
// const seller = offerData.role === 'seller' ? 'initiator' : 'partner'
// const buyer = offerData.role === 'buyer' ? 'initiator' : 'partner'
// payments.getPayLink(offerData)
//     .then(payLink => {
//         offer.update({
//             offerStatusId: sequelize.literal(`(SELECT id FROM offerstatuses WHERE value = 'accepted')`)
//         }, { where: { id: offerId } })
//         bot.telegram.sendMessage(offerData[buyer].chat_id, i18n.t(offerData[buyer].locale, 'offerAccepted', { id: offerId, roleAction: i18n.t(offerData[buyer].locale, 'buyerOfferAccepted', { payLink: payLink.url }) }))
//         bot.telegram.sendMessage(offerData[seller].chat_id, i18n.t(offerData[seller].locale, 'offerAccepted', { id: offerId, roleAction: i18n.t(offerData[buyer].locale, 'sellerOfferAccepted') }))
//         //dev purposes
//         // setTimeout(() => {
//         //     if(offerData.paymentMethod.value === 'paymentMethod_QIWI' || offerData.paymentMethod.value === 'paymentMethod_CARD'){
//         //         axios.post('http://localhost:777/v1/payment/qiwi/', {
//         //             bill:{
//         //                 status:{
//         //                     value:'PAID'
//         //                 },
//         //                 billId:payLink.id
//         //             }
//         //         })
//         //     }else{
//         //         axios.post('http://localhost:777/v1/payment/crypto/', {
//         //             status: '100',
//         //             txn_id: payLink.id
//         //         })
//         //     }
//         // }, 3*1000);
//     })
//     .catch(er => {
//         console.log(er)
//         bot.telegram.sendMessage(offerData.partner.chat_id, i18n.t(offerData.partner.locale, 'offerError'))
//     })
//     .finally(() => { return ctx.scene.enter('mainMenu') })