import { ModuleMetadata, Type } from "@nestjs/common";
import { Composer, Context, FilterQuery, Middleware, SessionFlavor } from "grammy";
import { I18nContextFlavor } from "@grammyjs/i18n";
import { Menu, MenuFlavor } from "@grammyjs/menu";
import { botOfferDto } from "src/mikroorm/dto/create-offer.dto";
import { match } from "src/bot/common/helpers";
import { Router } from '@grammyjs/router'
import { Offers, OffersRole } from "src/mikroorm/entities/Offers";
import { Arbitraries } from "src/mikroorm/entities/Arbitraries";

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
    mode: OfferMode
  },
  step: BotStep,
  pendingOffer: botOfferDto
}
export enum OfferMode {
  edit = "edit",
  default = "default",
}
export class OfferCallbackData {
  constructor(callback_data: string) {
    const data = callback_data.split(':')
    if (data.length !== 4) throw new Error('incorrect OfferCallbackData payload!')
    this.type = data[0]
    this.action = data[1]
    this.mode = data[2] as OfferMode
    this.payload = data[3]
  }
  type: string;
  action: string;
  mode: OfferMode;
  payload: any
}
export type BotContext = Context & SessionFlavor<Session> & I18nContextFlavor & MenuFlavor

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
  getComposer(): Composer<any> {
    return this._composer
  }
}
export class BaseMenu {
  protected _menu: Menu
  getMenu(): Menu {
    return this._menu
  }
}
export class BaseRouter {
  protected _router: Router<BotContext>
  getComposer(): Router<BotContext> {
    return this._router
  }
}
export abstract class BasePaymentController {
  abstract init: () => Promise<void>
  abstract getPayLink: (offer: Offers) => Promise<paymentURL>
  abstract sellerWithdraw: (offer: botOfferDto) => Promise<string>
  abstract arbitraryWithdraw: (arb: Arbitraries) => Promise<string>
}
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
  //menu edit steps
  setWallet = "setWallet",
  setArbitrary = "setArbitrary",
  setFeedback = "setFeedback",
}