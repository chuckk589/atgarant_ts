import { ModuleMetadata } from '@nestjs/common';
import { Api, Composer, Context, SessionFlavor } from 'grammy';
import { I18nContext, I18nContextFlavor } from '@grammyjs/i18n';
import { Menu, MenuControlPanel, MenuFlavor } from '@grammyjs/menu';
import { botOfferDto } from 'src/mikroorm/dto/create-offer.dto';
import { Router } from '@grammyjs/router';
import { Offers } from 'src/mikroorm/entities/Offers';
import { Arbitraries } from 'src/mikroorm/entities/Arbitraries';
import { InvoicesType } from 'src/mikroorm/entities/Invoices';
import { Update, UserFromGetMe } from '@grammyjs/types';
import { Message } from '@grammyjs/menu/out/deps.node';
export interface GrammyBotOptions {
    token: string;
    composers?: any[];
    middleware?: any[];
}
export interface PaymentsOptions {
    mode: 'coin-payments' | 'btc-core';
}
export interface GrammyBotOptionsAsync extends Pick<ModuleMetadata, 'imports'> {
    useFactory?: (...args: any[]) => Promise<GrammyBotOptions> | GrammyBotOptions;
    inject?: any[];
}
export interface PaymentsOptionsAsync {
    useFactory?: (...args: any[]) => Promise<PaymentsOptions>;
    inject?: any[];
}
export interface Session {
    user: {
        acceptedRules: number;
        mode: string;
    };
    menuId: number;
    step: BotStep;
    pendingOffer: botOfferDto;
    editedOffer: Offers;
    editedArb: Arbitraries;
}
export declare class OfferCallbackData {
    constructor(callback_data: string);
    type: string;
    action: string;
    mode: string;
    payload: any;
}
export declare class BotContext extends Context implements SessionFlavor<Session>, I18nContextFlavor, MenuFlavor {
    constructor(update: Update, api: Api, me: UserFromGetMe);
    menu: MenuControlPanel;
    i18n: I18nContext;
    match: string;
    clean: () => Promise<void>;
    cleanAndReply: (text: string, other?: any, signal?: any) => Promise<Message.TextMessage>;
    replyAndSave: (text: string, other?: any, signal?: any) => Promise<void>;
    cleanReplySave: (text: string, other?: any, signal?: any) => Promise<void>;
    save: (messageId: number) => {};
    get session(): Session;
    set session(session: Session);
}
export declare class ListenerMetadata {
    constructor(method: TMethod, query: any, key: string | symbol);
    method: TMethod;
    query: string | RegExp;
    key: string;
}
export declare class MenuListenerMetadata {
    constructor(name: string, key: string | symbol);
    name: string;
    parent?: string;
    key: string;
}
export declare type NewArbResponse = {
    error: boolean;
    errorMessage?: string;
    inviteLink?: string;
    chat_id?: string;
};
export declare type NewArbitraryOptions = {
    chatData: NewArbResponse;
    offerId: number;
    reason: string;
    issuerId: number;
    moderatorId: number;
};
export declare class BaseComposer {
    constructor();
    protected _composer: Composer<any>;
    getMiddleware(): Composer<any>;
}
export declare class BaseMenu {
    protected _menu: Menu;
    getMiddleware(): Menu;
}
export declare class BaseRouter {
    protected _router: Router<BotContext>;
    getMiddleware(): Router<BotContext>;
}
export declare abstract class BasePaymentController {
    abstract init: () => Promise<void>;
    abstract getPayLink: (offer: Offers) => Promise<paymentURL>;
    abstract sellerWithdraw: (offer: Offers) => Promise<void>;
    abstract arbitraryWithdraw: (arb: Arbitraries) => Promise<void>;
    abstract withDraw: (amount: number, address: string, type: InvoicesType, offerId: number, currency: string) => Promise<void>;
}
export declare type WithDrawOptions = {
    amount: number;
    currency: string;
    type: InvoicesType;
    txnId: string;
    offerId: number;
    url?: string;
};
export declare type ArbModeratorReview = {
    buyerPayout: number;
    sellerPayout: number;
    comment: string;
};
export declare type callbackQuery = [string, string, string];
export declare class PM {
    constructor(method: string, paymentMethod: string);
    id: number;
    method: string;
    feePercent: number;
    feeRaw: number;
    minSum: number;
    maxSum: number;
}
export declare class CommonConfig {
    constructor(id: string, offerStatus: string);
    id: number;
    value: string;
    name: string;
}
export declare type paymentURL = {
    url: string;
    id: string;
};
export declare enum TMethod {
    command = "command",
    on = "on",
    use = "use",
    hears = "hears",
    text = "text",
    menu = "menu",
    submenu = "submenu",
    back = "back"
}
export declare enum BotStep {
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
    setWallet = "setWallet",
    setArbitrary = "setArbitrary",
    setFeedbackP = "setFeedbackP",
    setFeedbackN = "setFeedbackN"
}
