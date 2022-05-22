import { Offers, OffersFeePayer, OffersRole } from '../entities/Offers';
export declare class botOfferDto {
    constructor(offer: Offers);
    id?: number;
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
