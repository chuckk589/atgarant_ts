import { ModuleMetadata, Type } from "@nestjs/common";
import { Api, Composer, Context, FilterQuery, Middleware, SessionFlavor } from "grammy";
import { I18nContext, I18nContextFlavor } from "@grammyjs/i18n";
import { Menu, MenuControlPanel, MenuFlavor } from "@grammyjs/menu";
import { botOfferDto } from "src/mikroorm/dto/create-offer.dto";
import { match } from "src/bot/common/helpers";
import { Router } from '@grammyjs/router'
import { Offers, OffersRole } from "src/mikroorm/entities/Offers";
import { Arbitraries } from "src/mikroorm/entities/Arbitraries";
import { InvoicesType } from "src/mikroorm/entities/Invoices";
import { Update, UserFromGetMe } from "@grammyjs/types";
import { Message } from "@grammyjs/menu/out/deps.node";

export interface GrammyBotOptions {
  token: string;
  composers?: any[],
  middleware?: any[]
}
export interface PaymentsOptions {
  mode: 'coin-payments' | 'btc-core'
}
export interface GrammyBotOptionsAsync extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (...args: any[]) => Promise<GrammyBotOptions> | GrammyBotOptions
  inject?: any[];
}
export interface PaymentsOptionsAsync {
  useFactory?: (...args: any[]) => Promise<PaymentsOptions>
  inject?: any[];
}

export interface Session {
  user: {
    acceptedRules: number,
    mode: string
  },
  menuId: number,
  step: BotStep,
  pendingOffer: botOfferDto,
  editedOffer: Offers,
  editedArb: Arbitraries
}

export class OfferCallbackData {
  constructor(callback_data: string) {
    const data = callback_data.split(':')
    if (data.length !== 4) throw new Error('incorrect OfferCallbackData payload!')
    this.type = data[0]
    this.action = data[1]
    this.mode = data[2]
    this.payload = data[3]
  }
  type: string;
  action: string;
  mode: string;
  payload: any
}

export class BotContext extends Context implements SessionFlavor<Session>, I18nContextFlavor, MenuFlavor {
  constructor(update: Update, api: Api, me: UserFromGetMe) {
    super(update, api, me);
    this.cleanAndReply = async (text: string, other?: any, signal?: any) => {
      await this.clean()
      return this.reply(text, other, signal)
    }
    this.replyAndSave = async (text: string, other?: any, signal?: any) => {
      await this.reply(text, other, signal).then(r => this.session.menuId = r.message_id)
    }
    this.cleanReplySave = async (text: string, other?: any, signal?: any) => {
      await this.clean()
      await this.replyAndSave(text, other, signal)
    }
    this.clean = async () => {
      if (this.session.menuId) {
        await this.api.deleteMessage(this.from.id, this.session.menuId).catch(() => { })
        this.session.menuId = undefined
      }
    }
    this.save = async (messageId: number) => {
      this.session.menuId = messageId
    }
  }
  menu: MenuControlPanel;
  i18n: I18nContext;
  match: string
  clean: () => Promise<void>
  cleanAndReply: (text: string, other?: any, signal?: any) => Promise<Message.TextMessage>;
  replyAndSave: (text: string, other?: any, signal?: any) => Promise<void>;
  cleanReplySave: (text: string, other?: any, signal?: any) => Promise<void>;
  save: (messageId: number) => {}

  get session(): Session {
    throw new Error("Method not implemented.");
  }
  set session(session: Session) {
    throw new Error("Method not implemented.");
  }

}
//export type BotContext = Context & SessionFlavor<Session> & I18nContextFlavor & MenuFlavor & Cleaner
export class ListenerMetadata {
  constructor(method: TMethod, query: any, key: string | symbol) {
    this.method = method;
    this.query = method == TMethod.hears ? match(query) : query;
    this.key = String(key);
  }
  method: TMethod;
  query: string | RegExp;
  key: string;
}
export class MenuListenerMetadata {
  constructor(name: string, key: string | symbol) {
    this.name = name
    this.key = String(key)
  }
  name: string;
  parent?: string;
  key: string;
}
export type NewArbResponse = {
  error: boolean;
  errorMessage?: string
  inviteLink?: string;
  chat_id?: string;
}
export type NewArbitraryOptions = {
  chatData: NewArbResponse
  offerId: number
  reason: string
  issuerId: number
}
export class BaseComposer {
  constructor() { }
  protected _composer: Composer<any>
  getMiddleware(): Composer<any> {
    return this._composer
  }
}
export class BaseMenu {
  protected _menu: Menu
  getMiddleware(): Menu {
    return this._menu
  }
}
export class BaseRouter {
  protected _router: Router<BotContext>
  getMiddleware(): Router<BotContext> {
    return this._router
  }
}
export abstract class BasePaymentController {
  abstract init: () => Promise<void>
  abstract getPayLink: (offer: Offers) => Promise<paymentURL>
  abstract sellerWithdraw: (offer: Offers) => Promise<void>
  abstract arbitraryWithdraw: (arb: Arbitraries) => Promise<void>
  abstract withDraw: (amount: number, address: string, type: InvoicesType, offerId: number, currency: string) => Promise<void>
}

export type WithDrawOptions = {
  amount: number;
  currency: string;
  type: InvoicesType;
  txnId: string,
  offerId: number;
  url?: string
}
export type ArbModeratorReview = { buyerPayout: number, sellerPayout: number, comment: string }
export type callbackQuery = [string, string, string]
export class PM {
  constructor(method: string, paymentMethod: string) {
    const values = paymentMethod.split(':')
    this.feeRaw = Number.parseInt(values[0])
    this.feePercent = Number.parseInt(values[1])
    this.minSum = Number.parseInt(values[2])
    this.maxSum = Number.parseInt(values[3])
    this.id = Number.parseInt(values[4])
    this.method = method
  }
  id: number;
  method: string;
  feePercent: number;
  feeRaw: number;
  minSum: number;
  maxSum: number;
}
export class CommonConfig {
  constructor(id: string, offerStatus: string) {
    const values = offerStatus.split(':')
    this.value = values[0]
    this.name = values[1]
    this.id = Number(id)
  }
  id: number;
  value: string;
  name: string
}
export type paymentURL = { url: string, id: string }
export enum TMethod {
  command = "command",
  on = "on",
  use = "use",
  hears = "hears",
  text = "text",
  menu = "menu",
  submenu = "submenu",
  back = "back",
}
export enum BotStep {
  default = "default",
  rules = "rules",
  roles = "roles",
  fee = "fee",
  contact = "contact",
  payment = "payment",
  value = "value",
  shipping = "shipping",
  productDetails = "productDetails",
  shippingDetails = "shippingDetails",
  productRest = "productRest",
  rest = "rest",
  refund = "refund",
  checkout = "checkout",
  manage = "manage",
  offer = "offer",
  arbitrary = "arbitrary",
  //menu edit steps
  setWallet = "setWallet",
  setArbitrary = "setArbitrary",
  setFeedbackP = "setFeedbackP",
  setFeedbackN = "setFeedbackN",
}