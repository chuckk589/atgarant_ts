import { Keyboard } from "grammy";
import { InlineKeyboardMarkup } from "grammy/out/platform.node";
import { Offers } from "src/mikroorm/entities/Offers";
import { BotContext, OfferMode } from "src/types/interfaces";
import i18n from "../middleware/i18n";

export const mainKeyboard = (ctx: BotContext): Keyboard => {
    return new Keyboard()
        .text(ctx.i18n.t("offers")).text(ctx.i18n.t("arbitraries")).text(ctx.i18n.t("account")).row()
        .text(ctx.i18n.t("rules")).text(ctx.i18n.t("instructions")).text(ctx.i18n.t("info")).row()
}
export const offerKeyboard = (ctx: BotContext): Keyboard => {
    return new Keyboard()
        .text(ctx.i18n.t("createOffer")).text(ctx.i18n.t("allOffers")).text(ctx.i18n.t("activeOffers")).row()
        .text(ctx.i18n.t("back"))
}
export const arbitraryKeyboard = (ctx: BotContext): Keyboard => {
    return new Keyboard()
        .text(ctx.i18n.t("activeArbitraries")).text(ctx.i18n.t("allArbitraries")).row()
        .text(ctx.i18n.t("back"))
}
export const accountKeyboard = (ctx: BotContext): Keyboard => {
    return new Keyboard()
        .text(ctx.i18n.t("accountWeb")).text(ctx.i18n.t("findUser")).text(ctx.i18n.t("changeLang")).row()
        .text(ctx.i18n.t("back"))
}



export const manageOfferMenu = (offerId: number, locale: string, mode: OfferMode): InlineKeyboardMarkup => {
    return {
        inline_keyboard: [
            [
                { callback_data: `offer:edit:${mode}:${offerId}`, text: i18n.t(locale, "editOffer",) },
                { callback_data: `offer:reject:${mode}:${offerId}`, text: i18n.t(locale, "rejectOffer") },
                { callback_data: `offer:admit:${mode}:${offerId}`, text: i18n.t(locale, "admitOffer") }
            ]
        ]
    }
}
export const manageExistingOfferMenu = (offer: Offers, ctx: BotContext): InlineKeyboardMarkup => {
    const status = offer.offerStatus.value
    //const initiator = offer.initiator.chat_id === ctx.from.id
    return {
        inline_keyboard: [
            [
                { callback_data: '2', text: ctx.i18n.t('setWallet') }
            ]
        ]
    }
    // return Markup.inlineKeyboard([
    //     [Markup.callbackButton(ctx.i18n.t('setWallet'), `setWallet`)],
    //     status === 'pending' && initiator ? [Markup.callbackButton(ctx.i18n.t('sendOffer'), `sendOffer`)] : [],
    //     isSeller && status === 'payed' ? [Markup.callbackButton(ctx.i18n.t('confirmShipping'), `confirmShipping`)] : [],
    //     isSeller && offer.sellerWalletData && status === 'arrived' ? [Markup.callbackButton(ctx.i18n.t('getPayout'), `getPayout`)] : [],
    //     !isSeller && status === 'shipped' ? [Markup.callbackButton(ctx.i18n.t('confirmArrival'), `confirmArrival`)] : [],
    //     status !== 'closed' && status !== 'arbitrary' && status !== 'pending' ? [Markup.callbackButton(ctx.i18n.t('openArbitrary'), `openArbitrary`)] : [],
    //     offer.offerStatus.id > 5 ? [Markup.callbackButton(ctx.i18n.t('leaveFeedback'), `leaveFeedback`)] : [],
    // ]).extra()
}