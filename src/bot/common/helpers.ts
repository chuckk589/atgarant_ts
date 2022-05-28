import { Collection } from '@mikro-orm/core';
import { InlineQueryResult, InlineQueryResultArticle } from 'grammy/out/platform.node';
import { botOfferDto } from 'src/mikroorm/dto/create-offer.dto';
import { Arbitraries } from 'src/mikroorm/entities/Arbitraries';
import { Invoices, InvoicesType } from 'src/mikroorm/entities/Invoices';
import { Offers, OffersRole } from 'src/mikroorm/entities/Offers';
import { Reviews } from 'src/mikroorm/entities/Reviews';
import { Users } from 'src/mikroorm/entities/Users';
import { BotContext, PM } from 'src/types/interfaces';
import i18n from '../middleware/i18n';

export function match(key: string): RegExp {
  const locales: string[] = i18n.availableLocales();
  return new RegExp(locales.map((l) => `^${i18n.t(l, key)}$`).join('|'));
}

// export const label = (ctx: BotContext) => {
//     return (label: string) => ctx.i18n.t(label)
// }
export const label = (payload: { text: string; payload?: string }) => {
  return (ctx: BotContext) => ctx.i18n.t(payload.text);
};

export const checkoutMessage = (offer: botOfferDto, code: string) => {
  const paymentMethod = Object.keys(process.env)
    .filter((k) => k.includes('paymentMethod'))
    .map((k) => new PM(k.split('_').pop(), process.env[k]))
    .find((k) => k.id == offer.paymentMethodId);
  return (
    i18n.t(code, 'orderCheckout') +
    i18n.t(code, 'orderCheckoutFeePayer') +
    ': ' +
    i18n.t(code, offer.feePayer) +
    '\n' +
    i18n.t(code, 'orderValue') +
    ': ' +
    offer.offerValue +
    ' p\n' +
    i18n.t(code, 'orderCheckoutPaymentMethod') +
    ': ' +
    i18n.t(code, paymentMethod.method) +
    '\n' +
    i18n.t(code, 'orderCheckoutFee') +
    ': ' +
    offer.feeBaked +
    ' p\n' +
    i18n.t(code, 'orderCheckoutEstimatedShipping') +
    ': ' +
    new Date(offer.estimatedShipping).toLocaleDateString() +
    '\n' +
    i18n.t(code, 'orderCheckoutProductDetails') +
    ': ' +
    offer.productDetails +
    '\n' +
    i18n.t(code, 'orderCheckoutProductAdditionalDetails') +
    ': ' +
    (offer.productAdditionalDetails || i18n.t(code, 'notDefined')) +
    '\n' +
    i18n.t(code, 'orderCheckoutRestDetails') +
    ': ' +
    (offer.restDetails || i18n.t(code, 'notDefined')) +
    '\n' +
    i18n.t(code, 'orderCheckoutRefundDetails') +
    ': ' +
    offer.refundDetails +
    '\n' +
    i18n.t(code, 'orderCheckoutSellerWalletData') +
    ': ' +
    (offer.sellerWalletData || i18n.t(code, 'notDefined')) +
    '\n' +
    i18n.t(code, 'orderCheckoutOfferStatus') +
    ': ' +
    offer.offerStatus +
    '\n' +
    i18n.t(code, 'buyer') +
    ': ' +
    (offer.role === 'buyer' ? offer.initiator_chatId : offer.partner_chatId) +
    '\n' +
    i18n.t(code, 'seller') +
    ': ' +
    (offer.role === 'seller' ? offer.initiator_chatId : offer.partner_chatId)
  );
};
export const checkoutArbMessage = function (arb: Arbitraries, code: string) {
  return (
    i18n.t(code, 'arbitraryCheckout') +
    i18n.t(code, 'arbitraryReason') +
    ': ' +
    arb.reason +
    '\n' +
    i18n.t(code, 'arbitraryStatus') +
    ': ' +
    i18n.t(code, arb.status) +
    '\n' +
    i18n.t(code, 'arbitraryComment') +
    ': ' +
    arb.comment +
    '\n' +
    i18n.t(code, 'arbitraryPayout', { buyer: arb.buyerPayout, seller: arb.sellerPayout }) +
    '\n' +
    i18n.t(code, 'arbitraryOfferId', { id: arb.offer.id }) +
    '\n' +
    i18n.t(code, 'arbitraryInitiator') +
    ': ' +
    (arb.offer.initiator.username || arb.offer.initiator.chatId) +
    '\n'
  );
};

export const usersQueryMessage = (users: Users[]): InlineQueryResultArticle[] => {
  return users.map((u) => {
    const message = `Профиль: @${u.username}\nid: ${u.chatId}\nДата регистрации: ${new Date(
      u.createdAt,
    ).toLocaleDateString()}\nПродажи: ${u.profile.offersAsSeller}\nПокупки: ${
      u.profile.offersAsBuyer
    }\nОбщая сумма сделок: ${u.profile.totalOfferValueRub} руб.\nПоложительные отзывы: ${
      u.profile.feedbackPositive
    }\nОтрицательные отзывы: ${u.profile.feedbackNegative}\nНарушения: ${u.profile.violations}`;
    return {
      type: 'article',
      id: String(u.id),
      title: u.username,
      description: u.firstName || 'Неизвестно',
      input_message_content: {
        message_text: message,
      },
    };
  });
};
export const getInvoiceValue = (invoices: Collection<Invoices>): number => {
  return invoices
    .toArray()
    .filter((i) => i.type == InvoicesType.IN)
    .reduce((s, c) => s + c.value, 0);
};
export const getInvoiceFee = (invoices: Collection<Invoices>): number => {
  return invoices
    .toArray()
    .filter((i) => i.type == InvoicesType.IN)
    .reduce((s, c) => s + c.fee, 0);
};
/**
 * Extracts opposite user from passed offer
 * may be unsafe in case user ids reach telegram chat id values
 * @param from id or chatid
 */
export const getOppositeUser = (offer: Offers, from: number | string): Users => {
  return offer.initiator.chatId === String(from) || offer.initiator.id === Number(from)
    ? offer.partner
    : offer.initiator;
};
/**
 * Extracts self from passed offer
 * may be unsafe in case user ids reach telegram chat id values
 * @param from id or chatid
 */
export const getSelf = (offer: Offers, from: number | string): Users => {
  return offer.initiator.chatId === String(from) || offer.initiator.id === Number(from)
    ? offer.initiator
    : offer.partner;
};
export const getOffersMessage = (offers: Offers[], chatId: number): string => {
  const message = offers.reduce((sum, cur) => {
    const invoices = cur.invoices.toArray().filter((i) => i.type == InvoicesType.IN);
    let currencyString = '';
    if (!invoices.length) {
      currencyString = `${cur.offerValue} RUB`;
    } else {
      currencyString = `${invoices.reduce((s, c) => s + c.value, 0)} ${cur.paymentMethod.value.split('_').pop()}`;
    }
    sum += `ID ${cur.id}: ${getOppositeUser(cur, chatId).chatId} - ${currencyString} - ${cur.offerStatus.name} \n`;
    return sum;
  }, '');
  return message;
};

export const getArbMessage = (arb: Arbitraries[], chatId: number, code: string): string => {
  const message = arb.reduce((sum, cur) => {
    const currency = cur.offer.paymentMethod.value.split('_').pop();
    // const offerValue = cur.offer.invoices
    //   .toArray()
    //   .filter((i) => i.type == InvoicesType.IN)
    //   .reduce((s, c) => s + c.value, 0);
    sum += `ID ${cur.id}: ${i18n.t(code, 'arbitraryOfferId', { id: cur.offer.id })}, ${
      getOppositeUser(cur.offer, chatId).chatId
    } - ${cur.offer.offerValue} ${currency.match(/QIWI|CARD/) ? 'RUB' : currency}, ${i18n.t(code, cur.status)}\n`;
    return sum;
  }, i18n.t(code, 'arbHistory'));
  return message;
};
export const usersByRoles = (offer: Offers): { seller: Users; buyer: Users } => {
  const seller = offer.role === OffersRole.SELLER ? 'initiator' : 'partner';
  const buyer = offer.role === OffersRole.BUYER ? 'initiator' : 'partner';
  return {
    seller: offer[seller],
    buyer: offer[buyer],
  };
};
export const leftReview = (reviews: Collection<Reviews>, from: number | string): boolean => {
  return !reviews.toArray().some((r) => r.author.id == from || r.author.chatId == from);
};
export const isInitiator = (ctx: BotContext): boolean =>
  ctx.session.pendingOffer.initiator_chatId === String(ctx.from.id);
export const isSeller = (ctx: BotContext): boolean => {
  return (
    (ctx.session.editedOffer.role === OffersRole.SELLER
      ? ctx.session.editedOffer.initiator.chatId
      : ctx.session.editedOffer.partner.chatId) == String(ctx.from.id)
  );
};
