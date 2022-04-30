"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedbackMenu = exports.manageOfferMenu = exports.findUserMenu = exports.languageMenu = exports.accountKeyboard = exports.arbitraryKeyboard = exports.offerKeyboard = exports.mainKeyboard = void 0;
const grammy_1 = require("grammy");
const i18n_1 = __importDefault(require("../middleware/i18n"));
const mainKeyboard = (ctx) => {
    return new grammy_1.Keyboard()
        .text(ctx.i18n.t("offers")).text(ctx.i18n.t("arbitraries")).text(ctx.i18n.t("account")).row()
        .text(ctx.i18n.t("rules")).text(ctx.i18n.t("instructions")).text(ctx.i18n.t("info")).row();
};
exports.mainKeyboard = mainKeyboard;
const offerKeyboard = (ctx) => {
    return new grammy_1.Keyboard()
        .text(ctx.i18n.t("createOffer")).text(ctx.i18n.t("allOffers")).text(ctx.i18n.t("activeOffers")).row()
        .text(ctx.i18n.t("back"));
};
exports.offerKeyboard = offerKeyboard;
const arbitraryKeyboard = (ctx) => {
    return new grammy_1.Keyboard()
        .text(ctx.i18n.t("activeArbitraries")).text(ctx.i18n.t("allArbitraries")).row()
        .text(ctx.i18n.t("back"));
};
exports.arbitraryKeyboard = arbitraryKeyboard;
const accountKeyboard = (ctx) => {
    return new grammy_1.Keyboard()
        .text(ctx.i18n.t("accountWeb")).text(ctx.i18n.t("findUser")).text(ctx.i18n.t("changeLang")).row()
        .text(ctx.i18n.t("back"));
};
exports.accountKeyboard = accountKeyboard;
const languageMenu = (ctx) => {
    return {
        inline_keyboard: [
            [
                { callback_data: 'lang:::ru', text: ctx.i18n.t('ru') },
                { callback_data: 'lang:::en', text: ctx.i18n.t('en') },
            ]
        ]
    };
};
exports.languageMenu = languageMenu;
const findUserMenu = (ctx) => {
    return {
        inline_keyboard: [
            [
                { switch_inline_query_current_chat: String(ctx.from.id), text: ctx.i18n.t('findUser') },
            ]
        ]
    };
};
exports.findUserMenu = findUserMenu;
const manageOfferMenu = (offerId, locale, mode) => {
    return {
        inline_keyboard: [
            [
                { callback_data: `offer:edit:${mode}:${offerId}`, text: i18n_1.default.t(locale, "editOffer") },
                { callback_data: `offer:reject:${mode}:${offerId}`, text: i18n_1.default.t(locale, "rejectOffer") },
                { callback_data: `offer:admit:${mode}:${offerId}`, text: i18n_1.default.t(locale, "admitOffer") }
            ]
        ]
    };
};
exports.manageOfferMenu = manageOfferMenu;
const feedbackMenu = (offerId, locale) => {
    return {
        inline_keyboard: [
            [
                { callback_data: `offer:feedback:positive:${offerId}`, text: i18n_1.default.t(locale, "positive") },
                { callback_data: `offer:feedback:negative:${offerId}`, text: i18n_1.default.t(locale, "negative") },
            ]
        ]
    };
};
exports.feedbackMenu = feedbackMenu;
//# sourceMappingURL=keyboards.js.map