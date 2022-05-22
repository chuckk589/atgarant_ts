import { Keyboard } from 'grammy';
import { InlineKeyboardMarkup } from 'grammy/out/platform.node';
import { Offers } from 'src/mikroorm/entities/Offers';
import { BotContext } from 'src/types/interfaces';
import i18n from '../middleware/i18n';

// keyboards
export const mainKeyboard = (ctx: BotContext): Keyboard => {
  return new Keyboard()
    .text(ctx.i18n.t('offers'))
    .text(ctx.i18n.t('arbitraries'))
    .text(ctx.i18n.t('account'))
    .row()
    .text(ctx.i18n.t('rules'))
    .text(ctx.i18n.t('instructions'))
    .text(ctx.i18n.t('info'))
    .row();
};
export const offerKeyboard = (ctx: BotContext): Keyboard => {
  return new Keyboard()
    .text(ctx.i18n.t('createOffer'))
    .text(ctx.i18n.t('allOffers'))
    .text(ctx.i18n.t('activeOffers'))
    .row()
    .text(ctx.i18n.t('back'));
};
export const arbitraryKeyboard = (ctx: BotContext): Keyboard => {
  return new Keyboard()
    .text(ctx.i18n.t('activeArbitraries'))
    .text(ctx.i18n.t('allArbitraries'))
    .row()
    .text(ctx.i18n.t('back'));
};
export const accountKeyboard = (ctx: BotContext): Keyboard => {
  return new Keyboard()
    .text(ctx.i18n.t('accountWeb'))
    .text(ctx.i18n.t('findUser'))
    .text(ctx.i18n.t('changeLang'))
    .row()
    .text(ctx.i18n.t('back'));
};
//inline keyboards

export const languageMenu = (ctx: BotContext): InlineKeyboardMarkup => {
  return {
    inline_keyboard: [
      [
        { callback_data: 'lang:::ru', text: ctx.i18n.t('ru') },
        { callback_data: 'lang:::en', text: ctx.i18n.t('en') },
      ],
    ],
  };
};
export const findUserMenu = (ctx: BotContext): InlineKeyboardMarkup => {
  return {
    inline_keyboard: [[{ switch_inline_query_current_chat: String(ctx.from.id), text: ctx.i18n.t('findUser') }]],
  };
};
export const manageOfferMenu = (offerId: number, locale: string, mode: string): InlineKeyboardMarkup => {
  return {
    inline_keyboard: [
      [
        { callback_data: `offer:edit:${mode}:${offerId}`, text: i18n.t(locale, 'editOffer') },
        { callback_data: `offer:reject:${mode}:${offerId}`, text: i18n.t(locale, 'rejectOffer') },
        { callback_data: `offer:admit:${mode}:${offerId}`, text: i18n.t(locale, 'admitOffer') },
      ],
    ],
  };
};

export const feedbackMenu = (offerId: number, locale: string): InlineKeyboardMarkup => {
  return {
    inline_keyboard: [
      [
        { callback_data: `offer:feedback:positive:${offerId}`, text: i18n.t(locale, 'positive') },
        { callback_data: `offer:feedback:negative:${offerId}`, text: i18n.t(locale, 'negative') },
      ],
    ],
  };
};
