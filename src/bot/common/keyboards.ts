import { Keyboard } from "grammy";
import { InlineKeyboardMarkup } from "grammy/out/platform.node";
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