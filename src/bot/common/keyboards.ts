import { Keyboard } from "grammy";
import { BotContext } from "src/types/interfaces";

export function mainKeyboard(ctx: BotContext): Keyboard {
    return new Keyboard()
        .text(ctx.i18n.t("offers")).text(ctx.i18n.t("arbitraries")).text(ctx.i18n.t("account")).row()
        .text(ctx.i18n.t("rules")).text(ctx.i18n.t("instructions")).text(ctx.i18n.t("info")).row()
}
export function offerKeyboard(ctx: BotContext): Keyboard {
    return new Keyboard()
        .text(ctx.i18n.t("createOffer")).text(ctx.i18n.t("allOffers")).text(ctx.i18n.t("activeOffers"))
}