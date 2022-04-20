import { Offers, OffersFeePayer, OffersRole } from "../entities/Offers";
import { Users } from "../entities/Users";

export class botOfferDto {
    constructor(offer: Offers) {
        this.initiator_chatId = offer.initiator?.chatId
        this.role = offer.role
        this.feePayer = offer.feePayer
        this.partner_chatId = offer.partner?.chatId
        this.offerValue = offer.offerValue
        this.paymentMethodId = offer.paymentMethod?.id
        this.feeBaked = offer.feeBaked
        this.estimatedShipping = new Date(offer.estimatedShipping)
        this.productDetails = offer.productDetails
        this.shippingDetails = offer.shippingDetails
        this.productAdditionalDetails = offer.productAdditionalDetails
        this.restDetails = offer.restDetails
        this.refundDetails = offer.refundDetails
        this.sellerWalletData = offer.sellerWalletData
        this.offerStatus = offer.offerStatus?.name || 'На согласовании'
    }
    initiator_chatId: string;
    role: OffersRole;
    sellerWalletData: string;
    feePayer: OffersFeePayer;
    partner_chatId: string;
    offerValue: number;
    paymentMethodId: number;
    feeBaked: number;
    estimatedShipping: Date;
    offerStatus: string;
    productDetails: string;
    shippingDetails: string;
    productAdditionalDetails: string;
    restDetails: string;
    refundDetails: string;
}
