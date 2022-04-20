import { Controller, forwardRef, Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Bot } from 'grammy';
import { AppConfigService } from 'src/app-config/app-config.controller';
import i18n from 'src/bot/middleware/i18n';
import { BOT_NAME } from 'src/constants';
import { botOfferDto } from 'src/mikroorm/dto/create-offer.dto';
import { Offers } from 'src/mikroorm/entities/Offers';
import { BotContext, OfferMode } from 'src/types/interfaces';
import { AppEventsService } from './app-events.service';
import { offerController } from '../bot/offer/offer.controller'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { manageOfferMenu } from 'src/bot/common/keyboards';

// type OfferExtend = {
//     offerStatus: { name: string };
//     initiator: { username?: string, chat_id?: string }
//     partner: { username?: string, chat_id?: string }
//  @Inject(BOT_NAME) private options: any
// };

@Controller()
export class AppEventsController {
    constructor(
        private readonly appEventsService: AppEventsService,
        private readonly appConfigService: AppConfigService,
        @Inject(forwardRef(() => BOT_NAME)) private bot: Bot<BotContext>,
        @InjectPinoLogger('AppEventsController') private readonly logger: PinoLogger
        // @Inject(BOT_NAME) private bot: Bot<BotContext>
    ) { }
    checkoutMessage(offer: botOfferDto, code: string) {
        const paymentMethod = this.appConfigService.payments.find(p => p.id == offer.paymentMethodId)
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
    // TODO payment link generation implementation  
    async offerAccepted(payload: any, from: string) {
        const offerData = await this.appEventsService.getOfferById(payload)
    }
    async offerCreated(offer: Offers | number, from: string) {
        if (typeof offer === 'number') {
            offer = await this.appEventsService.getOfferById(offer)
        }
        const destination = from === offer.partner.chatId ? 'initiator' : 'partner'
        const destLocale = offer[destination].locale
        const offerString = this.checkoutMessage(new botOfferDto(offer), destLocale)
        this.bot.api.sendMessage(offer[destination].chatId, i18n.t(destLocale, 'offerReceived') + '\n' + offerString, { reply_markup: manageOfferMenu(offer.id, destLocale, OfferMode.edit) })
    }

}
