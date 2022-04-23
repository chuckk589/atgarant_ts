import { Controller, forwardRef, Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Bot } from 'grammy';
import { AppConfigService } from 'src/app-config/app-config.service';
import i18n from 'src/bot/middleware/i18n';
import { BOT_NAME, PAYMENTS_CONTROLLER } from 'src/constants';
import { botOfferDto } from 'src/mikroorm/dto/create-offer.dto';
import { Offers } from 'src/mikroorm/entities/Offers';
import { BasePaymentController, BotContext, BotStep, OfferMode } from 'src/types/interfaces';
import { AppEventsService } from './app-events.service';
import { offerController } from 'src/bot/offer-menu/offer.controller'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { mainKeyboard, manageOfferMenu } from 'src/bot/common/keyboards';
import { checkoutMessage, getOppositeChatId, usersByRoles } from 'src/bot/common/helpers';


@Controller()
export class AppEventsController {
    async offerPayoutProcessed(txn_id: string) {
        const offer = await this.appEventsService.getOfferByTxnId(txn_id)
        const roleData = usersByRoles(offer)
        if (offer.offerStatus.value === 'arbitrary') {
            await this.appEventsService.closeArbitraryOfferAttempt(offer.id)
        } else {
            await this.appEventsService.updateOfferStatus<Offers>(offer, 'closed')
            this.bot.api.sendMessage(roleData.seller.chatId, i18n.t(roleData.seller.locale, 'sellerOfferPayoutComplete', { id: offer.id }))
        }
    }
    async offerPayed(txn_id: string) {
        const offer = await this.appEventsService.getOfferByTxnId(txn_id)
        const roleData = usersByRoles(offer)
        await this.appEventsService.updateOfferStatus<Offers>(offer, 'payed')
        this.bot.api.sendMessage(roleData.buyer.chatId, i18n.t(roleData.buyer.locale, 'buyerOfferPayed', { id: offer.id }))
        this.bot.api.sendMessage(roleData.seller.chatId, i18n.t(roleData.seller.locale, 'sellerOfferPayed', { id: offer.id }))
    }
    
    constructor(
        private readonly appEventsService: AppEventsService,
        private readonly appConfigService: AppConfigService,
        private readonly offerController: offerController,
        @Inject(forwardRef(() => BOT_NAME)) private bot: Bot<BotContext>,
        @InjectPinoLogger('AppEventsController') private readonly logger: PinoLogger,
        @Inject(PAYMENTS_CONTROLLER) private PaymentController: BasePaymentController
        // @Inject(BOT_NAME) private bot: Bot<BotContext>
    ) {
        setTimeout(() => {
           // this.offerPayoutProcessed('eeeer')
        }, 1000);
    }
    async offerRejectInitiated(payload: any, ctx: BotContext) {
        const offer = await this.appEventsService.updateOfferStatus<number>(payload, 'denied')
        await ctx.reply(ctx.i18n.t('start'), { reply_markup: mainKeyboard(ctx) })
        const destination = getOppositeChatId(offer, ctx.from.id)
        await this.bot.api.sendMessage(destination, ctx.i18n.t('offerRejected', { id: payload }))
    }
    async offerEditInitiated(payload: any, ctx: BotContext) {
        const offer = await this.appEventsService.getOfferById(payload)
        ctx.session.pendingOffer = new botOfferDto(offer)
        ctx.session.step = BotStep.roles
        await ctx.reply(ctx.i18n.t('askRole'), { reply_markup: this.offerController.getMenu() })
    }
    async offerAccepted(payload: any) {
        const offer = await this.appEventsService.getOfferById(payload)
        const roleData = usersByRoles(offer)
        this.appEventsService.updateOfferStatus<Offers>(offer, 'accepted')
        const link = await this.PaymentController.getPayLink(offer)
        this.bot.api.sendMessage(roleData.buyer.chatId, i18n.t(roleData.buyer.locale, 'offerAccepted', { id: offer.id, roleAction: i18n.t(roleData.buyer.locale, 'buyerOfferAccepted', { payLink: link.url }) }))
        this.bot.api.sendMessage(roleData.seller.chatId, i18n.t(roleData.seller.locale, 'offerAccepted', { id: offer.id, roleAction: i18n.t(roleData.seller.locale, 'sellerOfferAccepted') }))
    }
    async offerCreated(offer: Offers | number, from: string) {
        if (typeof offer === 'number') {
            offer = await this.appEventsService.getOfferById(offer)
        }
        const destination = from === offer.partner.chatId ? 'initiator' : 'partner'
        const destLocale = offer[destination].locale
        const offerString = checkoutMessage(new botOfferDto(offer), destLocale)
        this.bot.api.sendMessage(offer[destination].chatId, i18n.t(destLocale, 'offerReceived') + '\n' + offerString, { reply_markup: manageOfferMenu(offer.id, destLocale, OfferMode.edit) })
    }

}