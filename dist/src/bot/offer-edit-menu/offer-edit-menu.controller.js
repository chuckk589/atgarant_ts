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
exports.OfferEditMenuController = void 0;
const interfaces_1 = require("../../types/interfaces");
const decorators_1 = require("../common/decorators");
const menu_1 = require("@grammyjs/menu");
const helpers_1 = require("../common/helpers");
const app_events_controller_1 = require("../../app-events/app-events.controller");
const keyboards_1 = require("../common/keyboards");
let OfferEditMenuController = class OfferEditMenuController extends interfaces_1.BaseMenu {
    constructor(AppEventsController) {
        super();
        this.AppEventsController = AppEventsController;
        this.menu = new menu_1.Menu("offer-edit-menu")
            .dynamic((ctx, range) => {
            const status = ctx.session.editedOffer.offerStatus;
            const _isSeller = (0, helpers_1.isSeller)(ctx);
            const _canLeaveReview = (0, helpers_1.leftReview)(ctx.session.editedOffer.reviews, ctx.from.id);
            range.text(ctx.i18n.t('setWallet'), async (ctx) => {
                ctx.session.step = interfaces_1.BotStep.setWallet;
                await ctx.reply(ctx.i18n.t('askWallet'));
            });
            status.value === 'payed' && _isSeller && range.text(ctx.i18n.t('confirmShipping'), async (ctx) => {
                ctx.session.editedOffer.offerStatus = await this.AppEventsController.offerShipped(ctx.session.editedOffer);
                ctx.menu.update();
                ctx.reply(ctx.i18n.t('dataUpdated'));
            });
            status.value === 'arrived' && _isSeller && ctx.session.pendingOffer.sellerWalletData && range.text(ctx.i18n.t('getPayout'), async (ctx) => {
                ctx.session.editedOffer.offerStatus = await this.AppEventsController.offerPaymentRequested(ctx.session.editedOffer);
                ctx.menu.update();
                ctx.reply(ctx.i18n.t('sellerOfferPaymentRequested'));
            });
            status.value === 'shipped' && !_isSeller && ctx.session.pendingOffer.sellerWalletData && range.text(ctx.i18n.t('confirmArrival'), async (ctx) => {
                ctx.session.editedOffer.offerStatus = await this.AppEventsController.offerArrived(ctx.session.editedOffer);
                ctx.menu.update();
                ctx.reply(ctx.i18n.t('dataUpdated'));
            });
            status.value !== 'closed' && status.value !== 'arbitrary' && status.value !== 'pending' && range.text(ctx.i18n.t('openArbitrary'), async (ctx) => {
                ctx.session.step = interfaces_1.BotStep.setArbitrary;
                ctx.reply(ctx.i18n.t('askArbitraryReason'));
            });
            status.value === 'closed' && _canLeaveReview && range.text(ctx.i18n.t('leaveFeedback'), async (ctx) => {
                await ctx.reply(ctx.i18n.t('feedbackGroup'), { reply_markup: (0, keyboards_1.feedbackMenu)(ctx.session.editedOffer.id, ctx.i18n.locale()) });
            });
            return range;
        })
            .row();
    }
};
__decorate([
    (0, decorators_1.Menu)('offer-edit-menu'),
    __metadata("design:type", Object)
], OfferEditMenuController.prototype, "menu", void 0);
OfferEditMenuController = __decorate([
    decorators_1.MenuController,
    __metadata("design:paramtypes", [app_events_controller_1.AppEventsController])
], OfferEditMenuController);
exports.OfferEditMenuController = OfferEditMenuController;
//# sourceMappingURL=offer-edit-menu.controller.js.map