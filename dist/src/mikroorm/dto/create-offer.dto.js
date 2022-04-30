"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.botOfferDto = void 0;
class botOfferDto {
    constructor(offer) {
        this.initiator_chatId = offer.initiator?.chatId;
        this.role = offer.role;
        this.feePayer = offer.feePayer;
        this.partner_chatId = offer.partner?.chatId;
        this.offerValue = offer.offerValue;
        this.paymentMethodId = offer.paymentMethod?.id;
        this.feeBaked = offer.feeBaked;
        this.estimatedShipping = new Date(offer.estimatedShipping);
        this.productDetails = offer.productDetails;
        this.shippingDetails = offer.shippingDetails;
        this.productAdditionalDetails = offer.productAdditionalDetails;
        this.restDetails = offer.restDetails;
        this.refundDetails = offer.refundDetails;
        this.sellerWalletData = offer.sellerWalletData;
        this.offerStatus = offer.offerStatus?.name || 'На согласовании';
        this.id = offer.id;
    }
}
exports.botOfferDto = botOfferDto;
//# sourceMappingURL=create-offer.dto.js.map