import { botOfferDto } from 'src/mikroorm/dto/create-offer.dto'
import { InvoicesType } from 'src/mikroorm/entities/Invoices'
import { Offers, OffersRole } from 'src/mikroorm/entities/Offers'
import { Users } from 'src/mikroorm/entities/Users'
import { BotContext, PM } from 'src/types/interfaces'
import i18n from '../middleware/i18n'

export function match(key: string): RegExp {
    const locales: string[] = i18n.availableLocales()
    return new RegExp(locales.map(l => i18n.t(l, key)).join('|'))
}

// export const label = (ctx: BotContext) => {
//     return (label: string) => ctx.i18n.t(label)
// }
export const label = (payload: { text: string, payload?: string }) => {
    return (ctx: BotContext) => ctx.i18n.t(payload.text)
}

export const checkoutMessage = (offer: botOfferDto, code: string) => {
    const paymentMethod = Object.keys(process.env).filter(k => k.includes('paymentMethod'))
        .map(k => new PM(k.split('_').pop(), process.env[k]))
        .find(k => k.id == offer.paymentMethodId)
    return i18n.t(code, 'orderCheckout') +
        i18n.t(code, 'orderCheckoutFeePayer') + ': ' + i18n.t(code, offer.feePayer) + '\n' +
        i18n.t(code, 'orderValue') + ': ' + offer.offerValue + ' p\n' +
        i18n.t(code, 'orderCheckoutPaymentMethod') + ': ' + i18n.t(code, paymentMethod.method) + '\n' +
        i18n.t(code, 'orderCheckoutFee') + ': ' + offer.feeBaked + ' p\n' +
        i18n.t(code, 'orderCheckoutEstimatedShipping') + ': ' + new Date(offer.estimatedShipping).toLocaleDateString() + '\n' +
        i18n.t(code, 'orderCheckoutProductDetails') + ': ' + offer.productDetails + '\n' +
        i18n.t(code, 'orderCheckoutProductAdditionalDetails') + ': ' + (offer.productAdditionalDetails || i18n.t(code, 'notDefined')) + '\n' +
        i18n.t(code, 'orderCheckoutRestDetails') + ': ' + (offer.restDetails || i18n.t(code, 'notDefined')) + '\n' +
        i18n.t(code, 'orderCheckoutRefundDetails') + ': ' + offer.refundDetails + '\n' +
        i18n.t(code, 'orderCheckoutSellerWalletData') + ': ' + (offer.sellerWalletData || i18n.t(code, 'notDefined')) + '\n' +
        i18n.t(code, 'orderCheckoutOfferStatus') + ': ' + offer.offerStatus + '\n' +
        i18n.t(code, 'buyer') + ': ' + (offer.role === 'buyer' ? offer.initiator_chatId : offer.partner_chatId) + '\n' +
        i18n.t(code, 'seller') + ': ' + (offer.role === 'seller' ? offer.initiator_chatId : offer.partner_chatId)
}
export const getOppositeChatId = (offer: Offers, from: number): string => {
    return offer.initiator.chatId === String(from) ? offer.partner.chatId : offer.initiator.chatId
}
export const getOffersMessage = (offers: Offers[], chatId: number): string => {
    const message = offers.reduce((sum, cur) => {
        const invoices = cur.invoices.toArray().filter(i => i.type == InvoicesType.IN)
        let currencyString = ''
        if (!invoices.length) {
            currencyString = `${cur.offerValue} RUB`
        } else {
            currencyString = `${invoices.reduce((s, c) => s + c.value, 0)} ${cur.paymentMethod.value.split('_').pop()}`
        }
        sum += `ID ${cur.id}: ${getOppositeChatId(cur, chatId)} - ${currencyString} - ${cur.offerStatus.name} \n`
        return sum
    }, '')
    return message
}
export const usersByRoles = (offer: Offers): { seller: Users, buyer: Users } => {
    const seller = offer.role === OffersRole.SELLER ? 'initiator' : 'partner'
    const buyer = offer.role === OffersRole.BUYER ? 'initiator' : 'partner'
    return {
        seller: offer[seller],
        buyer: offer[buyer]
    }
}