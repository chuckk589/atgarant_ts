import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Users } from "src/mikroorm/entities/Users";
import { BotContext } from "src/types/interfaces";
import { AppConfigService } from "src/app-config/app-config.controller";
import { botOfferDto } from "src/mikroorm/dto/create-offer.dto";
import i18n from '../middleware/i18n'
import { Offers } from "src/mikroorm/entities/Offers";



@Injectable()
export class routerService {
  constructor(
    private readonly em: EntityManager,
    private readonly appConfigService: AppConfigService
  ) { }
  async fetchContact(ctx: BotContext): Promise<Users> {
    const user = await this.em.findOne(Users, {
      $or: [
        { chatId: ctx.message.text },
        { username: ctx.message.text.replace('@', '') }
      ]
    })
    return user
  }
  
}
    //console.log(offer) ctx['editOffer']()
  //   if(!i18n) i18n = {
  //     t : function (string){ return this[string]()},
  //     ...ctx
  // }
  // if (!offer.initiator) {
  //     offer.initiator = { username: from.username || from.id }
  // }
  // return i18n.t(code,'orderCheckout') +
  //     i18n.t(code,'orderCheckoutFeePayer') + ': ' + i18n.t(code,offer.feePayer) + '\n' +
  //     i18n.t(code,'orderValue') + ': ' + offer.offerValue + ' p\n' +
  //     i18n.t(code,'orderCheckoutPaymentMethod') + ': ' + (offer.paymentMethod.name || offer.paymentMethod.value.split('_').pop()) + '\n' +
  //     i18n.t(code,'orderCheckoutFee') + ': ' + offer.feeBaked  + ' p\n' +
  //     i18n.t(code,'orderCheckoutEstimatedShipping') + ': ' + offer.estimatedShipping + '\n' +
  //     i18n.t(code,'orderCheckoutProductDetails') + ': ' + offer.productDetails + '\n' +
  //     i18n.t(code,'orderCheckoutProductAdditionalDetails') + ': ' + (offer.productAdditionalDetails || i18n.t(code,'notDefined')) + '\n' +
  //     i18n.t(code,'orderCheckoutRestDetails') + ': ' + (offer.restDetails || i18n.t(code,'notDefined')) + '\n' +
  //     i18n.t(code,'orderCheckoutRefundDetails') + ': ' + offer.refundDetails + '\n' +
  //     i18n.t(code,'orderCheckoutSellerWalletData') + ': ' + (offer.sellerWalletData || i18n.t(code,'notDefined')) + '\n' +
  //     i18n.t(code,'orderCheckoutOfferStatus') + ': ' + (offer.offerStatus?.name || i18n.t(code,'notDefined')) + '\n' +
  //     i18n.t(code,'buyer') + ': ' + (offer.role === 'buyer' ? offer.initiator.username || offer.initiator.chat_id : offer.partner.username || offer.partner.chat_id || offer.partner) + '\n' +
  //     i18n.t(code,'seller') + ': ' + (offer.role === 'seller' ? offer.initiator.username || offer.initiator.chat_id : offer.partner.username || offer.partner.chat_id || offer.partner)