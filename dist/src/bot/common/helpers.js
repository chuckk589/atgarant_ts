"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSeller = exports.isInitiator = exports.leftReview = exports.usersByRoles = exports.getArbMessage = exports.getOffersMessage = exports.getSelf = exports.getOppositeUser = exports.getInvoiceFee = exports.getInvoiceValue = exports.usersQueryMessage = exports.checkoutArbMessage = exports.checkoutMessage = exports.label = exports.match = void 0;
const Invoices_1 = require("../../mikroorm/entities/Invoices");
const Offers_1 = require("../../mikroorm/entities/Offers");
const interfaces_1 = require("../../types/interfaces");
const i18n_1 = __importDefault(require("../middleware/i18n"));
function match(key) {
    const locales = i18n_1.default.availableLocales();
    return new RegExp(locales.map((l) => `^${i18n_1.default.t(l, key)}$`).join('|'));
}
exports.match = match;
const label = (payload) => {
    return (ctx) => ctx.i18n.t(payload.text);
};
exports.label = label;
const checkoutMessage = (offer, code) => {
    const paymentMethod = Object.keys(process.env)
        .filter((k) => k.includes('paymentMethod'))
        .map((k) => new interfaces_1.PM(k.split('_').pop(), process.env[k]))
        .find((k) => k.id == offer.paymentMethodId);
    return (i18n_1.default.t(code, 'orderCheckout') +
        i18n_1.default.t(code, 'orderCheckoutFeePayer') +
        ': ' +
        i18n_1.default.t(code, offer.feePayer) +
        '\n' +
        i18n_1.default.t(code, 'orderValue') +
        ': ' +
        offer.offerValue +
        ' p\n' +
        i18n_1.default.t(code, 'orderCheckoutPaymentMethod') +
        ': ' +
        i18n_1.default.t(code, paymentMethod.method) +
        '\n' +
        i18n_1.default.t(code, 'orderCheckoutFee') +
        ': ' +
        offer.feeBaked +
        ' p\n' +
        i18n_1.default.t(code, 'orderCheckoutEstimatedShipping') +
        ': ' +
        new Date(offer.estimatedShipping).toLocaleDateString() +
        '\n' +
        i18n_1.default.t(code, 'orderCheckoutProductDetails') +
        ': ' +
        offer.productDetails +
        '\n' +
        i18n_1.default.t(code, 'orderCheckoutProductAdditionalDetails') +
        ': ' +
        (offer.productAdditionalDetails || i18n_1.default.t(code, 'notDefined')) +
        '\n' +
        i18n_1.default.t(code, 'orderCheckoutRestDetails') +
        ': ' +
        (offer.restDetails || i18n_1.default.t(code, 'notDefined')) +
        '\n' +
        i18n_1.default.t(code, 'orderCheckoutRefundDetails') +
        ': ' +
        offer.refundDetails +
        '\n' +
        i18n_1.default.t(code, 'orderCheckoutSellerWalletData') +
        ': ' +
        (offer.sellerWalletData || i18n_1.default.t(code, 'notDefined')) +
        '\n' +
        i18n_1.default.t(code, 'orderCheckoutOfferStatus') +
        ': ' +
        offer.offerStatus +
        '\n' +
        i18n_1.default.t(code, 'buyer') +
        ': ' +
        (offer.role === 'buyer' ? offer.initiator_chatId : offer.partner_chatId) +
        '\n' +
        i18n_1.default.t(code, 'seller') +
        ': ' +
        (offer.role === 'seller' ? offer.initiator_chatId : offer.partner_chatId));
};
exports.checkoutMessage = checkoutMessage;
const checkoutArbMessage = function (arb, code) {
    return (i18n_1.default.t(code, 'arbitraryCheckout') +
        i18n_1.default.t(code, 'arbitraryReason') +
        ': ' +
        arb.reason +
        '\n' +
        i18n_1.default.t(code, 'arbitraryStatus') +
        ': ' +
        i18n_1.default.t(code, arb.status) +
        '\n' +
        i18n_1.default.t(code, 'arbitraryComment') +
        ': ' +
        arb.comment +
        '\n' +
        i18n_1.default.t(code, 'arbitraryPayout', { buyer: arb.buyerPayout, seller: arb.sellerPayout }) +
        '\n' +
        i18n_1.default.t(code, 'arbitraryOfferId', { id: arb.offer.id }) +
        '\n' +
        i18n_1.default.t(code, 'arbitraryInitiator') +
        ': ' +
        (arb.offer.initiator.username || arb.offer.initiator.chatId) +
        '\n');
};
exports.checkoutArbMessage = checkoutArbMessage;
const usersQueryMessage = (users) => {
    return users.map((u) => {
        const message = `Профиль: @${u.username}\nid: ${u.chatId}\nДата регистрации: ${new Date(u.createdAt).toLocaleDateString()}\nПродажи: ${u.profile.offersAsSeller}\nПокупки: ${u.profile.offersAsBuyer}\nОбщая сумма сделок: ${u.profile.totalOfferValueRub} руб.\nПоложительные отзывы: ${u.profile.feedbackPositive}\nОтрицательные отзывы: ${u.profile.feedbackNegative}\nНарушения: ${u.violations.length}`;
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
exports.usersQueryMessage = usersQueryMessage;
const getInvoiceValue = (invoices) => {
    return invoices
        .toArray()
        .filter((i) => i.type == Invoices_1.InvoicesType.IN)
        .reduce((s, c) => s + c.value, 0);
};
exports.getInvoiceValue = getInvoiceValue;
const getInvoiceFee = (invoices) => {
    return invoices
        .toArray()
        .filter((i) => i.type == Invoices_1.InvoicesType.IN)
        .reduce((s, c) => s + c.fee, 0);
};
exports.getInvoiceFee = getInvoiceFee;
const getOppositeUser = (offer, from) => {
    return offer.initiator.chatId === String(from) || offer.initiator.id === Number(from)
        ? offer.partner
        : offer.initiator;
};
exports.getOppositeUser = getOppositeUser;
const getSelf = (offer, from) => {
    return offer.initiator.chatId === String(from) || offer.initiator.id === Number(from)
        ? offer.initiator
        : offer.partner;
};
exports.getSelf = getSelf;
const getOffersMessage = (offers, chatId) => {
    const message = offers.reduce((sum, cur) => {
        const invoices = cur.invoices.toArray().filter((i) => i.type == Invoices_1.InvoicesType.IN);
        let currencyString = '';
        if (!invoices.length) {
            currencyString = `${cur.offerValue} RUB`;
        }
        else {
            currencyString = `${invoices.reduce((s, c) => s + c.value, 0)} ${cur.paymentMethod.value.split('_').pop()}`;
        }
        sum += `ID ${cur.id}: ${(0, exports.getOppositeUser)(cur, chatId).chatId} - ${currencyString} - ${cur.offerStatus.name} \n`;
        return sum;
    }, '');
    return message;
};
exports.getOffersMessage = getOffersMessage;
const getArbMessage = (arb, chatId, code) => {
    const message = arb.reduce((sum, cur) => {
        const currency = cur.offer.paymentMethod.value.split('_').pop();
        sum += `ID ${cur.id}: ${i18n_1.default.t(code, 'arbitraryOfferId', { id: cur.offer.id })}, ${(0, exports.getOppositeUser)(cur.offer, chatId).chatId} - ${cur.offer.offerValue} ${currency.match(/QIWI|CARD/) ? 'RUB' : currency}, ${i18n_1.default.t(code, cur.status)}\n`;
        return sum;
    }, i18n_1.default.t(code, 'arbHistory'));
    return message;
};
exports.getArbMessage = getArbMessage;
const usersByRoles = (offer) => {
    const seller = offer.role === Offers_1.OffersRole.SELLER ? 'initiator' : 'partner';
    const buyer = offer.role === Offers_1.OffersRole.BUYER ? 'initiator' : 'partner';
    return {
        seller: offer[seller],
        buyer: offer[buyer],
    };
};
exports.usersByRoles = usersByRoles;
const leftReview = (reviews, from) => {
    return false;
};
exports.leftReview = leftReview;
const isInitiator = (ctx) => ctx.session.pendingOffer.initiator_chatId === String(ctx.from.id);
exports.isInitiator = isInitiator;
const isSeller = (ctx) => {
    return ((ctx.session.editedOffer.role === Offers_1.OffersRole.SELLER
        ? ctx.session.editedOffer.initiator.chatId
        : ctx.session.editedOffer.partner.chatId) == String(ctx.from.id));
};
exports.isSeller = isSeller;
//# sourceMappingURL=helpers.js.map