
import { AppConfigService } from "src/app-config/app-config.service";
import { Offers, OffersFeePayer, OffersRole } from "src/mikroorm/entities/Offers";
import { BaseComposer, BotContext, BotStep, callbackQuery, OfferCallbackData } from "src/types/interfaces";
import { Command, ComposerController, Hears, On, Use, } from "../common/decorators";
import { accountKeyboard, arbitraryKeyboard, findUserMenu, languageMenu, mainKeyboard, offerKeyboard } from "../common/keyboards";
import { offerController } from "../offer-menu/offer.controller";
import { globalService } from './global.service'
import { AppEventsController } from '../../app-events/app-events.controller';
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { getArbMessage, getOffersMessage, usersQueryMessage } from "../common/helpers";
import { OfferEditMenuController } from 'src/bot/offer-edit-menu/offer-edit-menu.controller'
import { ArbEditMenuController } from 'src/bot/arb-edit-menu/arb-edit-menu.controller'
import { InlineKeyboard } from "grammy";

@ComposerController
export class globalComposer extends BaseComposer {
  constructor(
    private readonly globalService: globalService,
    private readonly AppConfigService: AppConfigService,
    private readonly offerController: offerController,
    private readonly OfferEditMenuController: OfferEditMenuController,
    private readonly ArbEditMenuController: ArbEditMenuController,
    private readonly AppEventsController: AppEventsController,
    @InjectPinoLogger('globalComposer') private readonly logger: PinoLogger,
  ) {
    super()
  }
  mode: string = this.AppConfigService.get<string>('node_env');
  url: string = this.AppConfigService.get<string>('url')

  @Use()
  menu = this.offerController.getMiddleware()

  @Use()
  menu1 = this.OfferEditMenuController.getMiddleware()

  @Use()
  menu2 = this.ArbEditMenuController.getMiddleware()

  @Command('start')
  start: Function = async (ctx: BotContext) => {
    const user = await this.globalService.fetchUser(ctx)
    ctx.i18n.locale(user.locale)
    ctx.session.step = BotStep.default
    ctx.session.user.acceptedRules = user.acceptedRules
    await ctx.reply(ctx.i18n.t('start'), { reply_markup: mainKeyboard(ctx) })
  }
  @Hears('back')
  back: Function = async (ctx: BotContext) => {
    ctx.session.step = BotStep.default
    await ctx.reply(ctx.i18n.t('start'), { reply_markup: mainKeyboard(ctx) })
  }

  //* OFFERS BLOCK
  @Hears('offers')
  offers: Function = async (ctx: BotContext) => {
    //FIXME:
    // const imageurl = this.mode === 'development' ? 'https://picsum.photos/200/300' : this.url + '/media/04.jpg';
    const imageurl = 'https://picsum.photos/200/300'
    await ctx.replyWithPhoto(imageurl, { caption: ctx.i18n.t('offerMenu'), reply_markup: offerKeyboard(ctx) })
  }
  @Hears('createOffer')
  createOffer: Function = async (ctx: BotContext) => {
    //ctx.session.step = BotStep.refund
    // ctx.session.pendingOffer = {
    //   feePayer: OffersFeePayer.BUYER,
    //   role: OffersRole.SELLER,
    //   paymentMethodId: 1,
    //   offerValue: 1111,
    //   feeBaked: 111.1,
    //   sellerWalletData: '',
    //   offerStatus: 'На согласовании',
    //   estimatedShipping: new Date(),
    //   productDetails: '2',
    //   shippingDetails: '22',
    //   productAdditionalDetails: '33',
    //   restDetails: '22',
    //   refundDetails: '11',
    //   initiator_chatId: '517717745',
    //   partner_chatId: '517717745'
    // }
    ctx.session.step = ctx.session.user.acceptedRules ? BotStep.roles : BotStep.rules
    const message = ctx.session.user.acceptedRules ? ctx.i18n.t('askRole') : ctx.i18n.t('offerWarning')
    await ctx.cleanReplySave(message, { reply_markup: this.offerController.getMiddleware() })
  }
  //* OFFERS BLOCK
  @Hears('arbitraries')
  arbitraries: Function = async (ctx: BotContext) => {
    //FIXME:
    //const imageurl = this.mode == 'development' ? 'https://picsum.photos/200/300' : this.url + '/media/03.jpg';
    const imageurl = 'https://picsum.photos/200/300'
    await ctx.replyWithPhoto(imageurl, { caption: ctx.i18n.t('arbitraries'), reply_markup: arbitraryKeyboard(ctx) })
  }

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

  @Hears('activeOffers')
  activeOffers = async (ctx: BotContext) => {
    const offers = await this.globalService.fetchActiveOffers(ctx.from.id)
    if (offers.length) {
      await ctx.reply(ctx.i18n.t('offerHistory') + getOffersMessage(offers, ctx.from.id))
      ctx.session.step = BotStep.offer
    } else {
      await ctx.reply(ctx.i18n.t('noData'))
    }
  }
  //* OFFERS BLOCK
  //* ARBITRARY BLOCK
  @Hears('activeArbitraries')
  activeArbitraries: Function = async (ctx: BotContext) => {
    const arbitraries = await this.globalService.fetchActiveArbs(ctx.from.id)
    if (arbitraries.length) {
      await ctx.reply(getArbMessage(arbitraries, ctx.from.id, ctx.i18n.locale()))
      ctx.session.step = BotStep.arbitrary
    } else {
      await ctx.reply(ctx.i18n.t('noData'))
    }
  }

  @Hears('allArbitraries')
  allArbitraries: Function = async (ctx: BotContext) => {
    const arbitraries = await this.globalService.fetchAllArbs(ctx.from.id)
    if (arbitraries.length) {
      await ctx.reply(getArbMessage(arbitraries, ctx.from.id, ctx.i18n.locale()))
      ctx.session.step = BotStep.arbitrary
    } else {
      await ctx.reply(ctx.i18n.t('noData'))
    }
  }
  //* ARBITRARY BLOCK
  @Hears('account')
  account: Function = async (ctx: BotContext) => {
    await ctx.reply(ctx.i18n.t('account'), { reply_markup: accountKeyboard(ctx) })
  }
  @Hears('accountWeb')
  web: Function = async (ctx: BotContext) => {
    const user = await this.globalService.fetchUser(ctx)
    const url = this.mode == 'development' ? `http://localhost:3001` : this.url
    if (user.password) {
      await ctx.reply(ctx.i18n.t('accountWebLink', { link: `${url}/#login` }), { parse_mode: 'HTML' })
    } else {
      const password = await this.globalService.createUserPassword(user)
      const login = ctx.from.id
      await ctx.reply(ctx.i18n.t('accountWebLink', { link: `${url}/#login?p=${password}&l=${login}` }) + '\n' + ctx.i18n.t('accountWebCreds', { pass: password, login: login }), { parse_mode: "HTML" })
    }
  }

  @Hears('rules')
  rules: Function = async (ctx: BotContext) => await ctx.reply(ctx.i18n.t('rules'))

  @Hears('instructions')
  instructions: Function = async (ctx: BotContext) => await ctx.reply(ctx.i18n.t('instructions'))

  @Hears('info')
  info: Function = async (ctx: BotContext) => await ctx.reply(ctx.i18n.t('info'))

  @Hears('findUser')
  findUser: Function = async (ctx: BotContext) => await ctx.reply(ctx.i18n.t('findUserInfo'), { reply_markup: findUserMenu(ctx) })

  @Hears('changeLang')
  changeLang: Function = async (ctx: BotContext) => await ctx.reply(ctx.i18n.t('languageGroup'), { reply_markup: languageMenu(ctx) })

  @On('inline_query')
  inline_query: Function = async (ctx: BotContext) => {
    const users = await this.globalService.fetchQueryUsers(ctx.inlineQuery.query)
    await ctx.answerInlineQuery(usersQueryMessage(users))
  }

  @On("callback_query:data")
  callbackHandler = async (ctx: BotContext) => {
    const data = new OfferCallbackData(ctx.update.callback_query.data)
    //type:action:mode:payload
    //accept button click
    if (data.type == 'offer') {
      if (data.action == 'admit') {
        try {
          //accept button clicked right after offer creation by initiator 
          if (data.mode == 'default') {
            await ctx.deleteMessage()
            const offer = await this.globalService.createOffer(ctx)
            await this.AppEventsController.offerCreated<Offers>(offer, String(ctx.from.id))
          }
          //accept button clicked after receiving an offer and NOT editing it
          else if (data.mode == 'edit') {
            await ctx.deleteMessage()
            await this.AppEventsController.offerAccepted(data.payload)
          }
          await ctx.reply(ctx.i18n.t('offerCreated'))
        } catch (error) {
          this.logger.error(error)
          ctx.reply(ctx.i18n.t('offerCreationFailed'))
        }
      }
      else if (data.action == 'edit') {
        //edit button clicked right after offer creation by initiator 
        if (data.mode == 'default') {
          ctx.session.step = BotStep.roles
          await ctx.cleanReplySave(ctx.i18n.t('askRole'), { reply_markup: this.offerController.getMiddleware() })
        }
        //edit button clicked after receiving an offer
        //need to write offer into receiving end session
        else if (data.mode == 'edit') {
          await ctx.deleteMessage()
          await this.AppEventsController.offerEditInitiated(data.payload, ctx)
        }
      }
      else if (data.action == 'reject') {
        if (data.mode == 'default') {
          ctx.session.step = BotStep.default
          await ctx.deleteMessage()
          await ctx.reply(ctx.i18n.t('start'), { reply_markup: mainKeyboard(ctx) })
        } else if (data.mode == 'edit') {
          await ctx.deleteMessage()
          await this.AppEventsController.offerRejectInitiated(data.payload, ctx)
        }
      }
      else if (data.action == 'feedback') {
        if (data.mode == 'positive') {
          ctx.session.step = BotStep.setFeedbackP
        } else {
          ctx.session.step = BotStep.setFeedbackN
        }
        await ctx.reply(ctx.i18n.t('askFeedbackText'))
      }
    }
    else if (data.type == 'lang') {
      const locale = data.payload
      ctx.i18n.locale(locale)
      await this.globalService.updateLocale(ctx.from.id, locale)
      return ctx.reply(ctx.i18n.t('langChanged'), { reply_markup: accountKeyboard(ctx) })
    }
  }
}