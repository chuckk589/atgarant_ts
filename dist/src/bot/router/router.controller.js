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
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerController = void 0;
const router_1 = require("@grammyjs/router");
const interfaces_1 = require("../../types/interfaces");
const decorators_1 = require("../common/decorators");
const router_service_1 = require("./router.service");
const offer_controller_1 = require("../offer-menu/offer.controller");
const app_config_service_1 = require("../../app-config/app-config.service");
const luxon_1 = require("luxon");
const common_1 = require("@nestjs/common");
const app_events_controller_1 = require("../../app-events/app-events.controller");
const create_offer_dto_1 = require("../../mikroorm/dto/create-offer.dto");
const keyboards_1 = require("../common/keyboards");
const helpers_1 = require("../common/helpers");
const offer_edit_menu_controller_1 = require("../offer-edit-menu/offer-edit-menu.controller");
const Reviews_1 = require("../../mikroorm/entities/Reviews");
let routerController = class routerController extends interfaces_1.BaseRouter {
    constructor(routerService, offerController, OfferEditMenuController, AppConfigService, AppEventsController) {
        super();
        this.routerService = routerService;
        this.offerController = offerController;
        this.OfferEditMenuController = OfferEditMenuController;
        this.AppConfigService = AppConfigService;
        this.AppEventsController = AppEventsController;
        this.router = new router_1.Router((ctx) => ctx.session.step)
            .route(interfaces_1.BotStep.contact, async (ctx) => {
            const user = await this.routerService.fetchContact(ctx);
            if (user) {
                if (user.chatId == String(ctx.from.id)) {
                    await ctx.reply(ctx.i18n.t('cannotAddSelfError'));
                }
                else {
                    ctx.session.step = interfaces_1.BotStep.fee;
                    ctx.session.pendingOffer.partner_chatId = user.chatId;
                    await ctx.cleanReplySave(ctx.i18n.t('askFeePayer'), { reply_markup: this.offerController.getMiddleware() });
                }
            }
            else {
                await ctx.reply(ctx.i18n.t('userNotFound', { user: ctx.message.text }));
            }
        })
            .route(interfaces_1.BotStep.value, async (ctx) => {
            const paymentMethod = this.AppConfigService.payments.find(p => p.id == Number(ctx.session.pendingOffer.paymentMethodId));
            const value = Number(ctx.message.text);
            if (value && value > paymentMethod.minSum && value < paymentMethod.maxSum) {
                ctx.session.pendingOffer.offerValue = value;
                ctx.session.pendingOffer.feeBaked = Math.max(value * paymentMethod.feePercent / 100, paymentMethod.feeRaw);
                ctx.session.step = interfaces_1.BotStep.shipping;
                await ctx.cleanReplySave(ctx.i18n.t('askEstimatedShipping'), { reply_markup: this.offerController.getMiddleware() });
            }
            else {
                ctx.reply(ctx.i18n.t('wrongDataOfferValue', { minSum: paymentMethod.minSum, maxSum: paymentMethod.maxSum }));
            }
        })
            .route(interfaces_1.BotStep.shipping, async (ctx) => {
            const date = luxon_1.DateTime.fromFormat(ctx.message.text, 'MM.dd.yyyy');
            if (date.isValid) {
                ctx.session.pendingOffer.estimatedShipping = date.toJSDate();
                ctx.session.step = interfaces_1.BotStep.productDetails;
                await ctx.cleanReplySave(ctx.i18n.t('askProductDetails'), { reply_markup: this.offerController.getMiddleware() });
            }
            else {
                await ctx.reply(ctx.i18n.t('wrongData'));
            }
        })
            .route(interfaces_1.BotStep.productDetails, async (ctx) => {
            ctx.session.pendingOffer.productDetails = ctx.message.text;
            ctx.session.step = interfaces_1.BotStep.shippingDetails;
            await ctx.cleanReplySave(ctx.i18n.t('askShippingDetails'), { reply_markup: this.offerController.getMiddleware() });
        })
            .route(interfaces_1.BotStep.shippingDetails, async (ctx) => {
            ctx.session.pendingOffer.shippingDetails = ctx.message.text;
            ctx.session.step = interfaces_1.BotStep.productRest;
            await ctx.cleanReplySave(ctx.i18n.t('askProductAdditionalDetails'), { reply_markup: this.offerController.getMiddleware() });
        })
            .route(interfaces_1.BotStep.productRest, async (ctx) => {
            ctx.session.pendingOffer.productAdditionalDetails = ctx.message.text;
            ctx.session.step = interfaces_1.BotStep.rest;
            await ctx.cleanReplySave(ctx.i18n.t('askRestDetails'), { reply_markup: this.offerController.getMiddleware() });
        })
            .route(interfaces_1.BotStep.rest, async (ctx) => {
            ctx.session.pendingOffer.restDetails = ctx.message.text;
            ctx.session.step = interfaces_1.BotStep.refund;
            await ctx.cleanReplySave(ctx.i18n.t('askProductRefundTime'), { reply_markup: this.offerController.getMiddleware() });
        })
            .route(interfaces_1.BotStep.refund, async (ctx) => {
            ctx.session.pendingOffer.refundDetails = ctx.message.text;
            ctx.session.pendingOffer.initiator_chatId = String(ctx.from.id);
            ctx.session.step = interfaces_1.BotStep.checkout;
            await ctx.cleanReplySave((0, helpers_1.checkoutMessage)(ctx.session.pendingOffer, ctx.i18n.locale()), { reply_markup: (0, keyboards_1.manageOfferMenu)(0, ctx.i18n.locale(), 'default') });
        })
            .route(interfaces_1.BotStep.offer, async (ctx) => {
            if (ctx.message && ctx.message.text && Number(ctx.message.text)) {
                const offer = await this.routerService.fetchOffer(Number(ctx.message.text), ctx.from.id);
                if (!offer)
                    return;
                ctx.session.editedOffer = offer;
                await ctx.cleanReplySave((0, helpers_1.checkoutMessage)(new create_offer_dto_1.botOfferDto(offer), ctx.i18n.locale()), { reply_markup: this.OfferEditMenuController.getMiddleware() });
            }
        })
            .route(interfaces_1.BotStep.setWallet, async (ctx) => {
            ctx.session.step = interfaces_1.BotStep.default;
            await this.routerService.setWallet(ctx);
            await ctx.reply(ctx.i18n.t('dataUpdated'));
        })
            .route(interfaces_1.BotStep.setArbitrary, async (ctx) => {
            ctx.session.step = interfaces_1.BotStep.default;
            ctx.session.editedOffer.offerStatus = await this.AppEventsController.arbOpened(ctx.session.editedOffer, ctx.message.text, ctx.from.id);
            await ctx.cleanReplySave((0, helpers_1.checkoutMessage)(new create_offer_dto_1.botOfferDto(ctx.session.editedOffer), ctx.i18n.locale()), { reply_markup: this.OfferEditMenuController.getMiddleware() });
        })
            .route(interfaces_1.BotStep.setFeedbackN || interfaces_1.BotStep.setFeedbackP, async (ctx) => {
            const rate = ctx.session.step == interfaces_1.BotStep.setFeedbackN ? Reviews_1.ReviewsRate.NEGATIVE : Reviews_1.ReviewsRate.POSITIVE;
            ctx.session.step = interfaces_1.BotStep.default;
            await this.AppEventsController.offerFeedback(ctx.session.editedOffer, ctx.message.text, ctx.from.id, rate);
            await ctx.reply(ctx.i18n.t('feedbackLeft'));
        })
            .route(interfaces_1.BotStep.arbitrary, async (ctx) => {
            if (ctx.message && ctx.message.text && Number(ctx.message.text)) {
                const arb = await this.routerService.fetchArb(Number(ctx.message.text), ctx.from.id);
                if (!arb)
                    return;
                ctx.session.editedArb = arb;
                await ctx.cleanReplySave((0, helpers_1.checkoutArbMessage)(arb, ctx.i18n.locale()), { reply_markup: this.OfferEditMenuController.getMiddleware() });
            }
        })
            .otherwise(ctx => {
            ctx.clean();
        });
    }
};
__decorate([
    (0, decorators_1.Use)(),
    __metadata("design:type", Object)
], routerController.prototype, "router", void 0);
routerController = __decorate([
    (0, common_1.Injectable)(),
    decorators_1.RouterController,
    __metadata("design:paramtypes", [router_service_1.routerService,
        offer_controller_1.offerController,
        offer_edit_menu_controller_1.OfferEditMenuController,
        app_config_service_1.AppConfigService,
        app_events_controller_1.AppEventsController])
], routerController);
exports.routerController = routerController;
//# sourceMappingURL=router.controller.js.map