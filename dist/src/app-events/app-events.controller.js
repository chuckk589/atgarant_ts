"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppEventsController = void 0;
const common_1 = require("@nestjs/common");
const grammy_1 = require("grammy");
const app_config_service_1 = require("../app-config/app-config.service");
const i18n_1 = __importDefault(require("../bot/middleware/i18n"));
const constants_1 = require("../constants");
const create_offer_dto_1 = require("../mikroorm/dto/create-offer.dto");
const Offers_1 = require("../mikroorm/entities/Offers");
const interfaces_1 = require("../types/interfaces");
const app_events_service_1 = require("./app-events.service");
const offer_controller_1 = require("../bot/offer-menu/offer.controller");
const nestjs_pino_1 = require("nestjs-pino");
const keyboards_1 = require("../bot/common/keyboards");
const helpers_1 = require("../bot/common/helpers");
const telegram_gateway_1 = require("../telegram/telegram.gateway");
const Arbitraries_1 = require("../mikroorm/entities/Arbitraries");
let AppEventsController = class AppEventsController {
    constructor(appEventsService, appConfigService, offerController, TelegramGateway, bot, logger, PaymentController) {
        this.appEventsService = appEventsService;
        this.appConfigService = appConfigService;
        this.offerController = offerController;
        this.TelegramGateway = TelegramGateway;
        this.bot = bot;
        this.logger = logger;
        this.PaymentController = PaymentController;
    }
    async arbOpened(offer, reason, issuerChatId) {
        let offerData = offer instanceof Offers_1.Offers ? offer : await this.appEventsService.getOfferById(offer);
        const mod = await this.appEventsService.getLeastBusyMod();
        const roleData = (0, helpers_1.usersByRoles)(offerData);
        const chatData = await this.TelegramGateway.newArbitraryChat(offerData.id);
        await this.appEventsService.createNewArbitrary({ offerId: offerData.id, chatData: chatData, issuerId: (0, helpers_1.getSelf)(offerData, issuerChatId).id, reason: reason });
        await this.appEventsService.updateOfferStatus(offerData, 'arbitrary');
        this.bot.api.sendMessage(roleData.buyer.chatId, i18n_1.default.t(roleData.buyer.locale, 'arbitraryCreated', { id: offerData.id, inviteLink: chatData.inviteLink }));
        this.bot.api.sendMessage(roleData.seller.chatId, i18n_1.default.t(roleData.seller.locale, 'arbitraryCreated', { id: offerData.id, inviteLink: chatData.inviteLink }));
        this.bot.api.sendMessage(`-${chatData.chat_id}`, (0, helpers_1.checkoutMessage)(new create_offer_dto_1.botOfferDto(offerData), 'ru'));
        this.bot.api.sendMessage(mod.chatId, i18n_1.default.t(mod.locale, 'arbiterPoke', { id: offerData.id, inviteLink: chatData.inviteLink }));
        return this.appConfigService.offerStatus('arbitrary');
    }
    async arbClosed(arb, modReview) {
        let arbData = arb instanceof Arbitraries_1.Arbitraries ? arb : await this.appEventsService.getArbById(arb);
        let message;
        if (arbData.status == Arbitraries_1.ArbitrariesStatus.ACTIVE) {
            arbData.status = Arbitraries_1.ArbitrariesStatus.CLOSED;
            message = i18n_1.default.t('ru', 'arbitraryClosed', { id: arbData.offer.id });
        }
        else if (arbData.status === Arbitraries_1.ArbitrariesStatus.DISPUTED) {
            arbData.status = Arbitraries_1.ArbitrariesStatus.CLOSEDF;
            message = i18n_1.default.t('ru', 'arbitraryClosedFinally', { id: arbData.offer.id });
            await this.appEventsService.updateOfferStatus(arbData.offer, 'closed');
        }
        arbData.comment = modReview.comment;
        arbData.sellerPayout = modReview.sellerPayout;
        arbData.buyerPayout = modReview.buyerPayout;
        await this.appEventsService.applyArbUpdate(arbData);
        if (modReview.buyerPayout || modReview.sellerPayout) {
            message += `\n${i18n_1.default.t('ru', 'arbitraryClosedCustomPayout', { buyer: modReview.buyerPayout, seller: modReview.sellerPayout })}`;
            await this.PaymentController.arbitraryWithdraw(arbData);
        }
        this.bot.api.sendMessage(`-${arbData.chatId}`, message);
        return arbData.status;
    }
    async arbDisputed(arb, issuerChatId) {
        let arbData = arb instanceof Arbitraries_1.Arbitraries ? arb : await this.appEventsService.getArbById(arb);
        arbData.status = Arbitraries_1.ArbitrariesStatus.DISPUTED;
        await this.appEventsService.applyArbUpdate(arbData);
        const roleData = (0, helpers_1.usersByRoles)(arbData.offer);
        const issuerRole = roleData.seller.chatId == String(issuerChatId) ? 'seller' : 'buyer';
        this.bot.api.sendMessage(`-${arbData.chatId}`, i18n_1.default.t('ru', 'disputeOpened', { initiator: i18n_1.default.t('ru', issuerRole) }));
        return Arbitraries_1.ArbitrariesStatus.DISPUTED;
    }
    async offerPayoutProcessed(txn_id) {
        const offer = await this.appEventsService.getOfferByTxnId(txn_id);
        const roleData = (0, helpers_1.usersByRoles)(offer);
        if (offer.offerStatus.value === 'arbitrary') {
            await this.appEventsService.closeArbitraryOfferAttempt(offer.id);
        }
        else {
            await this.appEventsService.updateOfferStatus(offer, 'closed');
            this.bot.api.sendMessage(roleData.seller.chatId, i18n_1.default.t(roleData.seller.locale, 'sellerOfferPayoutComplete', { id: offer.id }));
        }
    }
    async offerPayed(txn_id) {
        const offer = await this.appEventsService.getOfferByTxnId(txn_id);
        const roleData = (0, helpers_1.usersByRoles)(offer);
        await this.appEventsService.updateInvoiceStatus(txn_id, 'success');
        await this.appEventsService.updateOfferStatus(offer, 'payed');
        this.bot.api.sendMessage(roleData.buyer.chatId, i18n_1.default.t(roleData.buyer.locale, 'buyerOfferPayed', { id: offer.id }));
        this.bot.api.sendMessage(roleData.seller.chatId, i18n_1.default.t(roleData.seller.locale, 'sellerOfferPayed', { id: offer.id }));
    }
    async offerShipped(offer) {
        let offerData = offer instanceof Offers_1.Offers ? offer : await this.appEventsService.getOfferById(offer);
        const roleData = (0, helpers_1.usersByRoles)(offerData);
        await this.appEventsService.updateOfferStatus(offerData, 'shipped');
        this.bot.api.sendMessage(roleData.buyer.chatId, i18n_1.default.t(roleData.buyer.locale, 'buyerOfferShipped', { id: offerData.id }));
        this.bot.api.sendMessage(roleData.seller.chatId, i18n_1.default.t(roleData.seller.locale, 'buyerOfferShipped', { id: offerData.id }));
        return this.appConfigService.offerStatus('shipped');
    }
    async offerFeedback(offer, feedback, issuerChatId, rate) {
        let offerData = offer instanceof Offers_1.Offers ? offer : await this.appEventsService.getOfferById(offer);
        const recipient = (0, helpers_1.getOppositeUser)(offerData, issuerChatId);
        const issuer = (0, helpers_1.getSelf)(offerData, issuerChatId);
        await this.appEventsService.createNewReview(recipient.id, issuer.id, feedback, rate, offerData.id);
        const _rate = i18n_1.default.t(recipient.locale, rate);
        this.bot.api.sendMessage(recipient.chatId, i18n_1.default.t(recipient.locale, 'feedbackReceived', { id: offerData.id, rate: _rate, feedback: feedback }));
    }
    async offerArrived(offer) {
        let offerData = offer instanceof Offers_1.Offers ? offer : await this.appEventsService.getOfferById(offer);
        const roleData = (0, helpers_1.usersByRoles)(offerData);
        await this.appEventsService.updateOfferStatus(offerData, 'arrived');
        this.bot.api.sendMessage(roleData.buyer.chatId, i18n_1.default.t(roleData.buyer.locale, 'buyerOfferArrived', { id: offerData.id }));
        this.bot.api.sendMessage(roleData.seller.chatId, i18n_1.default.t(roleData.seller.locale, 'sellerOfferArrived', { id: offerData.id }));
        return this.appConfigService.offerStatus('arrived');
    }
    async offerPaymentRequested(offer) {
        let offerData = offer instanceof Offers_1.Offers ? offer : await this.appEventsService.getOfferById(offer);
        const roleData = (0, helpers_1.usersByRoles)(offerData);
        await this.appEventsService.updateOfferStatus(offerData, 'awaitingPayment');
        this.bot.api.sendMessage(roleData.seller.chatId, i18n_1.default.t(roleData.seller.locale, 'sellerOfferPaymentRequested', { id: offerData.id }));
        await this.PaymentController.sellerWithdraw(offerData);
        return this.appConfigService.offerStatus('awaitingPayment');
    }
    async offerRejectInitiated(payload, ctx) {
        const offer = await this.appEventsService.updateOfferStatus(payload, 'denied');
        await ctx.reply(ctx.i18n.t('start'), { reply_markup: (0, keyboards_1.mainKeyboard)(ctx) });
        const destination = (0, helpers_1.getOppositeUser)(offer, ctx.from.id);
        await this.bot.api.sendMessage(destination.chatId, ctx.i18n.t('offerRejected', { id: payload }));
    }
    async offerEditInitiated(payload, ctx) {
        const offer = await this.appEventsService.getOfferById(payload);
        ctx.session.pendingOffer = new create_offer_dto_1.botOfferDto(offer);
        ctx.session.step = interfaces_1.BotStep.roles;
        await ctx.reply(ctx.i18n.t('askRole'), { reply_markup: this.offerController.getMiddleware() });
    }
    async offerAccepted(payload) {
        const offer = await this.appEventsService.getOfferById(payload);
        const roleData = (0, helpers_1.usersByRoles)(offer);
        this.appEventsService.updateOfferStatus(offer, 'accepted');
        const link = await this.PaymentController.getPayLink(offer);
        this.bot.api.sendMessage(roleData.buyer.chatId, i18n_1.default.t(roleData.buyer.locale, 'offerAccepted', { id: offer.id, roleAction: i18n_1.default.t(roleData.buyer.locale, 'buyerOfferAccepted', { payLink: link.url }) }));
        this.bot.api.sendMessage(roleData.seller.chatId, i18n_1.default.t(roleData.seller.locale, 'offerAccepted', { id: offer.id, roleAction: i18n_1.default.t(roleData.seller.locale, 'sellerOfferAccepted') }));
    }
    async offerCreated(offer, from) {
        let offerData = offer instanceof Offers_1.Offers ? offer : await this.appEventsService.getOfferById(offer);
        const destination = (0, helpers_1.getOppositeUser)(offerData, from);
        const destLocale = destination.locale;
        const offerString = (0, helpers_1.checkoutMessage)(new create_offer_dto_1.botOfferDto(offerData), destLocale);
        this.bot.api.sendMessage(destination.chatId, i18n_1.default.t(destLocale, 'offerReceived') + '\n' + offerString, { reply_markup: (0, keyboards_1.manageOfferMenu)(offerData.id, destLocale, 'edit') });
    }
};
AppEventsController = __decorate([
    (0, common_1.Controller)(),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => constants_1.BOT_NAME))),
    __param(5, (0, nestjs_pino_1.InjectPinoLogger)('AppEventsController')),
    __param(6, (0, common_1.Inject)(constants_1.PAYMENTS_CONTROLLER)),
    __metadata("design:paramtypes", [app_events_service_1.AppEventsService,
        app_config_service_1.AppConfigService,
        offer_controller_1.offerController,
        telegram_gateway_1.TelegramGateway,
        grammy_1.Bot,
        nestjs_pino_1.PinoLogger,
        interfaces_1.BasePaymentController])
], AppEventsController);
exports.AppEventsController = AppEventsController;
//# sourceMappingURL=app-events.controller.js.map