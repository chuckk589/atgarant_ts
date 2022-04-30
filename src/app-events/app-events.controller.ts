import { Controller, forwardRef, Inject } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Bot } from 'grammy';
import { AppConfigService } from 'src/app-config/app-config.service';
import i18n from 'src/bot/middleware/i18n';
import { BOT_NAME, PAYMENTS_CONTROLLER } from 'src/constants';
import { botOfferDto } from 'src/mikroorm/dto/create-offer.dto';
import { Offers } from 'src/mikroorm/entities/Offers';
import { ArbModeratorReview, BasePaymentController, BotContext, BotStep } from 'src/types/interfaces';
import { AppEventsService } from './app-events.service';
import { offerController } from 'src/bot/offer-menu/offer.controller'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { mainKeyboard, manageOfferMenu } from 'src/bot/common/keyboards';
import { checkoutMessage, getOppositeUser, getSelf, usersByRoles } from 'src/bot/common/helpers';
import { TelegramGateway } from 'src/telegram/telegram.gateway'
import { ReviewsRate } from 'src/mikroorm/entities/Reviews';
import { Arbitraries, ArbitrariesStatus } from 'src/mikroorm/entities/Arbitraries';
import { Offerstatuses } from 'src/mikroorm/entities/Offerstatuses';
import { Invoices } from 'src/mikroorm/entities/Invoices';

//TODO: global app event response type with newstatus field
//TODO: try catch error for every event
@Controller()
export class AppEventsController {
    /**
     * @param {any} issuerChatId:number chatid or userid
     */
    async arbOpened<T = Offers | number>(offer: T, reason: string, issuerChatId: number): Promise<Offerstatuses> {
        let offerData: Offers = offer instanceof Offers ? offer : await this.appEventsService.getOfferById(<any>offer)
        const mod = await this.appEventsService.getLeastBusyMod()
        const roleData = usersByRoles(offerData)
        const chatData = await this.TelegramGateway.newArbitraryChat(offerData.id)
        await this.appEventsService.createNewArbitrary({ offerId: offerData.id, chatData: chatData, issuerId: getSelf(offerData, issuerChatId).id, reason: reason })
        await this.appEventsService.updateOfferStatus<Offers>(offerData, 'arbitrary')
        this.bot.api.sendMessage(roleData.buyer.chatId, i18n.t(roleData.buyer.locale, 'arbitraryCreated', { id: offerData.id, inviteLink: chatData.inviteLink }))
        this.bot.api.sendMessage(roleData.seller.chatId, i18n.t(roleData.seller.locale, 'arbitraryCreated', { id: offerData.id, inviteLink: chatData.inviteLink }))
        this.bot.api.sendMessage(`-${chatData.chat_id}`, checkoutMessage(new botOfferDto(offerData), 'ru'))
        this.bot.api.sendMessage(mod.chatId, i18n.t(mod.locale, 'arbiterPoke', { id: offerData.id, inviteLink: chatData.inviteLink }))
        return this.appConfigService.offerStatus<string>('arbitrary')
    }
    async arbClosed<T = Arbitraries | number>(arb: T, modReview: ArbModeratorReview): Promise<ArbitrariesStatus> {
        let arbData: Arbitraries = arb instanceof Arbitraries ? arb : await this.appEventsService.getArbById(<any>arb)
        let message: string
        if (arbData.status == ArbitrariesStatus.ACTIVE) {
            arbData.status = ArbitrariesStatus.CLOSED
            message = i18n.t('ru', 'arbitraryClosed', { id: arbData.offer.id })
        } else if (arbData.status === ArbitrariesStatus.DISPUTED) {
            arbData.status = ArbitrariesStatus.CLOSEDF
            message = i18n.t('ru', 'arbitraryClosedFinally', { id: arbData.offer.id })
            await this.appEventsService.updateOfferStatus<Offers>(arbData.offer, 'closed')
        }
        arbData.comment = modReview.comment
        arbData.sellerPayout = modReview.sellerPayout
        arbData.buyerPayout = modReview.buyerPayout
        await this.appEventsService.applyArbUpdate(arbData)
        if (modReview.buyerPayout || modReview.sellerPayout) {
            message += `\n${i18n.t('ru', 'arbitraryClosedCustomPayout', { buyer: modReview.buyerPayout, seller: modReview.sellerPayout })}`
            await this.PaymentController.arbitraryWithdraw(arbData)
        }
        this.bot.api.sendMessage(`-${arbData.chatId}`, message)
        return arbData.status
    }
    async arbDisputed<T = Arbitraries | number>(arb: T, issuerChatId: number): Promise<ArbitrariesStatus> {
        let arbData: Arbitraries = arb instanceof Arbitraries ? arb : await this.appEventsService.getArbById(<any>arb)
        arbData.status = ArbitrariesStatus.DISPUTED
        await this.appEventsService.applyArbUpdate(arbData)
        const roleData = usersByRoles(arbData.offer)
        const issuerRole = roleData.seller.chatId == String(issuerChatId) ? 'seller' : 'buyer'
        this.bot.api.sendMessage(`-${arbData.chatId}`, i18n.t('ru', 'disputeOpened', { initiator: i18n.t('ru', issuerRole) }))
        return ArbitrariesStatus.DISPUTED
    }
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
        await this.appEventsService.updateInvoiceStatus(txn_id, 'success')
        await this.appEventsService.updateOfferStatus<Offers>(offer, 'payed')
        this.bot.api.sendMessage(roleData.buyer.chatId, i18n.t(roleData.buyer.locale, 'buyerOfferPayed', { id: offer.id }))
        this.bot.api.sendMessage(roleData.seller.chatId, i18n.t(roleData.seller.locale, 'sellerOfferPayed', { id: offer.id }))
    }
    async offerShipped<T = Offers | number>(offer: T): Promise<Offerstatuses> {
        let offerData: Offers = offer instanceof Offers ? offer : await this.appEventsService.getOfferById(<any>offer)
        const roleData = usersByRoles(offerData)
        await this.appEventsService.updateOfferStatus<Offers>(offerData, 'shipped')
        this.bot.api.sendMessage(roleData.buyer.chatId, i18n.t(roleData.buyer.locale, 'buyerOfferShipped', { id: offerData.id }))
        this.bot.api.sendMessage(roleData.seller.chatId, i18n.t(roleData.seller.locale, 'buyerOfferShipped', { id: offerData.id }))
        return this.appConfigService.offerStatus<string>('shipped')
    }
    async offerFeedback<T = Offers | number>(offer: T, feedback: string, issuerChatId: number, rate: ReviewsRate) {
        let offerData: Offers = offer instanceof Offers ? offer : await this.appEventsService.getOfferById(<any>offer)
        const recipient = getOppositeUser(offerData, issuerChatId)
        const issuer = getSelf(offerData, issuerChatId)
        await this.appEventsService.createNewReview(recipient.id, issuer.id, feedback, rate, offerData.id)
        const _rate: string = i18n.t(recipient.locale, rate)
        this.bot.api.sendMessage(recipient.chatId, i18n.t(recipient.locale, 'feedbackReceived', { id: offerData.id, rate: _rate, feedback: feedback }))
    }
    async offerArrived<T = Offers | number>(offer: T): Promise<Offerstatuses> {
        let offerData: Offers = offer instanceof Offers ? offer : await this.appEventsService.getOfferById(<any>offer)
        const roleData = usersByRoles(offerData)
        await this.appEventsService.updateOfferStatus<Offers>(offerData, 'arrived')
        this.bot.api.sendMessage(roleData.buyer.chatId, i18n.t(roleData.buyer.locale, 'buyerOfferArrived', { id: offerData.id }))
        this.bot.api.sendMessage(roleData.seller.chatId, i18n.t(roleData.seller.locale, 'sellerOfferArrived', { id: offerData.id }))
        return this.appConfigService.offerStatus<string>('arrived')
    }
    async offerPaymentRequested<T = Offers | number>(offer: T): Promise<Offerstatuses> {
        let offerData: Offers = offer instanceof Offers ? offer : await this.appEventsService.getOfferById(<any>offer)
        const roleData = usersByRoles(offerData)
        await this.appEventsService.updateOfferStatus<Offers>(offerData, 'awaitingPayment')
        this.bot.api.sendMessage(roleData.seller.chatId, i18n.t(roleData.seller.locale, 'sellerOfferPaymentRequested', { id: offerData.id }))
        return this.appConfigService.offerStatus<string>('awaitingPayment')
        //TODO: FIX this.PaymentController.sellerWithdraw()
    }
    constructor(
        private readonly appEventsService: AppEventsService,
        private readonly appConfigService: AppConfigService,
        private readonly offerController: offerController,
        private readonly TelegramGateway: TelegramGateway,
        @Inject(forwardRef(() => BOT_NAME)) private bot: Bot<BotContext>,
        @InjectPinoLogger('AppEventsController') private readonly logger: PinoLogger,
        @Inject(PAYMENTS_CONTROLLER) private PaymentController: BasePaymentController
        // @Inject(BOT_NAME) private bot: Bot<BotContext>
    ) {
        // setTimeout(async () => {
        //     await this.openArbitrary('lol', 50, 48)
        // }, 1000);
    }
    async offerRejectInitiated(payload: any, ctx: BotContext) {
        const offer = await this.appEventsService.updateOfferStatus<number>(payload, 'denied')
        await ctx.reply(ctx.i18n.t('start'), { reply_markup: mainKeyboard(ctx) })
        const destination = getOppositeUser(offer, ctx.from.id)
        await this.bot.api.sendMessage(destination.chatId, ctx.i18n.t('offerRejected', { id: payload }))
    }
    async offerEditInitiated(payload: any, ctx: BotContext) {
        const offer = await this.appEventsService.getOfferById(payload)
        ctx.session.pendingOffer = new botOfferDto(offer)
        ctx.session.step = BotStep.roles
        await ctx.reply(ctx.i18n.t('askRole'), { reply_markup: this.offerController.getMiddleware() })
    }
    async offerAccepted(payload: any) {
        const offer = await this.appEventsService.getOfferById(payload)
        const roleData = usersByRoles(offer)
        this.appEventsService.updateOfferStatus<Offers>(offer, 'accepted')
        const link = await this.PaymentController.getPayLink(offer)
        this.bot.api.sendMessage(roleData.buyer.chatId, i18n.t(roleData.buyer.locale, 'offerAccepted', { id: offer.id, roleAction: i18n.t(roleData.buyer.locale, 'buyerOfferAccepted', { payLink: link.url }) }))
        this.bot.api.sendMessage(roleData.seller.chatId, i18n.t(roleData.seller.locale, 'offerAccepted', { id: offer.id, roleAction: i18n.t(roleData.seller.locale, 'sellerOfferAccepted') }))
    }
    async offerCreated<T = Offers | number>(offer: T, from: string) {
        let offerData: Offers = offer instanceof Offers ? offer : await this.appEventsService.getOfferById(<any>offer)
        const destination = getOppositeUser(offerData, from)
        const destLocale = destination.locale
        const offerString = checkoutMessage(new botOfferDto(offerData), destLocale)
        this.bot.api.sendMessage(destination.chatId, i18n.t(destLocale, 'offerReceived') + '\n' + offerString, { reply_markup: manageOfferMenu(offerData.id, destLocale, 'edit') })
    }

}