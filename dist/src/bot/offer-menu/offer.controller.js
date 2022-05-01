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
exports.offerController = void 0;
const menu_1 = require("@grammyjs/menu");
const app_config_service_1 = require("../../app-config/app-config.service");
const Offers_1 = require("../../mikroorm/entities/Offers");
const interfaces_1 = require("../../types/interfaces");
const decorators_1 = require("../common/decorators");
const helpers_1 = require("../common/helpers");
const keyboards_1 = require("../common/keyboards");
const offer_service_1 = require("./offer.service");
let offerController = class offerController extends interfaces_1.BaseMenu {
    constructor(offerService, configService) {
        super();
        this.offerService = offerService;
        this.configService = configService;
        this.menu = new menu_1.Menu("offer-menu")
            .dynamic((ctx, range) => {
            switch (ctx.session.step) {
                case interfaces_1.BotStep.rules: {
                    range.text((0, helpers_1.label)({ text: 'acceptRules' }), async (ctx) => {
                        await this.offerService.acceptRules(ctx);
                        ctx.session.step = interfaces_1.BotStep.roles;
                        await ctx.editMessageText(ctx.i18n.t('askRole'));
                    });
                    range.text((0, helpers_1.label)({ text: 'rejectRules' }), async (ctx) => {
                        await ctx.deleteMessage();
                        await ctx.reply(ctx.i18n.t('start'), { reply_markup: (0, keyboards_1.mainKeyboard)(ctx) });
                    });
                    range.text((0, helpers_1.label)({ text: 'getRules' }), ctx => ctx.reply(ctx.i18n.t('rulesContent')));
                    break;
                }
                case interfaces_1.BotStep.roles: {
                    range.text((0, helpers_1.label)({ text: 'buyer' }), async (ctx) => {
                        ctx.session.step = interfaces_1.BotStep.contact;
                        ctx.session.pendingOffer.role = Offers_1.OffersRole.BUYER;
                        await ctx.editMessageText(ctx.i18n.t('askContact'));
                    });
                    range.text((0, helpers_1.label)({ text: 'seller' }), async (ctx) => {
                        ctx.session.step = interfaces_1.BotStep.contact;
                        ctx.session.pendingOffer.role = Offers_1.OffersRole.SELLER;
                        await ctx.editMessageText(ctx.i18n.t('askContact'));
                    });
                    break;
                }
                case interfaces_1.BotStep.contact: {
                    range.text((0, helpers_1.label)({ text: 'back' }), async (ctx) => {
                        ctx.session.step = interfaces_1.BotStep.roles;
                        await ctx.editMessageText(ctx.i18n.t('askRole'));
                    });
                    break;
                }
                case interfaces_1.BotStep.fee: {
                    range.text((0, helpers_1.label)({ text: 'buyer' }), async (ctx) => {
                        ctx.session.step = interfaces_1.BotStep.payment;
                        ctx.session.pendingOffer.feePayer = Offers_1.OffersFeePayer.BUYER;
                        await ctx.editMessageText(ctx.i18n.t('askPaymentMethod'));
                    });
                    range.text((0, helpers_1.label)({ text: 'seller' }), async (ctx) => {
                        ctx.session.step = interfaces_1.BotStep.payment;
                        ctx.session.pendingOffer.feePayer = Offers_1.OffersFeePayer.SELLER;
                        await ctx.editMessageText(ctx.i18n.t('askPaymentMethod'));
                    });
                    break;
                }
                case interfaces_1.BotStep.payment: {
                    const pms = this.configService.payments;
                    pms.map(pm => range.text({ text: ctx.i18n.t(pm.method) || pm.method, payload: String(pm.id) }, async (ctx) => {
                        ctx.session.step = interfaces_1.BotStep.value;
                        ctx.session.pendingOffer.paymentMethodId = Number(ctx.match);
                        await ctx.editMessageText(ctx.i18n.t('askOfferValue'));
                    }));
                    break;
                }
                case interfaces_1.BotStep.value: {
                    range.text((0, helpers_1.label)({ text: 'back' }), async (ctx) => {
                        ctx.session.step = interfaces_1.BotStep.payment;
                        await ctx.editMessageText(ctx.i18n.t('askPaymentMethod'));
                    });
                    break;
                }
                case interfaces_1.BotStep.shipping: {
                    range.text((0, helpers_1.label)({ text: 'back' }), async (ctx) => {
                        ctx.session.step = interfaces_1.BotStep.value;
                        await ctx.editMessageText(ctx.i18n.t('askOfferValue'));
                    });
                    break;
                }
                case interfaces_1.BotStep.productDetails: {
                    range.text((0, helpers_1.label)({ text: 'back' }), async (ctx) => {
                        ctx.session.step = interfaces_1.BotStep.shipping;
                        await ctx.editMessageText(ctx.i18n.t('askEstimatedShipping'));
                    });
                    break;
                }
                case interfaces_1.BotStep.shippingDetails: {
                    range.text((0, helpers_1.label)({ text: 'back' }), async (ctx) => {
                        ctx.session.step = interfaces_1.BotStep.productDetails;
                        await ctx.editMessageText(ctx.i18n.t('askProductDetails'));
                    });
                    break;
                }
                case interfaces_1.BotStep.productRest: {
                    range.text((0, helpers_1.label)({ text: 'back' }), async (ctx) => {
                        ctx.session.step = interfaces_1.BotStep.shippingDetails;
                        await ctx.editMessageText(ctx.i18n.t('askShippingDetails'));
                    });
                    break;
                }
                case interfaces_1.BotStep.rest: {
                    range.text((0, helpers_1.label)({ text: 'back' }), async (ctx) => {
                        ctx.session.step = interfaces_1.BotStep.productRest;
                        await ctx.editMessageText(ctx.i18n.t('askProductAdditionalDetails'));
                    });
                    break;
                }
                case interfaces_1.BotStep.refund: {
                    range.text((0, helpers_1.label)({ text: 'back' }), async (ctx) => {
                        ctx.session.step = interfaces_1.BotStep.rest;
                        await ctx.editMessageText(ctx.i18n.t('askRestDetails'));
                    });
                    break;
                }
            }
            return range;
        })
            .row();
    }
};
__decorate([
    (0, decorators_1.Menu)('offer-menu'),
    __metadata("design:type", Object)
], offerController.prototype, "menu", void 0);
offerController = __decorate([
    decorators_1.MenuController,
    __metadata("design:paramtypes", [offer_service_1.offerService,
        app_config_service_1.AppConfigService])
], offerController);
exports.offerController = offerController;
//# sourceMappingURL=offer.controller.js.map