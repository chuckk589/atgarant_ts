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
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalComposer = void 0;
const app_config_service_1 = require("../../app-config/app-config.service");
const interfaces_1 = require("../../types/interfaces");
const decorators_1 = require("../common/decorators");
const keyboards_1 = require("../common/keyboards");
const offer_controller_1 = require("../offer-menu/offer.controller");
const global_service_1 = require("./global.service");
const app_events_controller_1 = require("../../app-events/app-events.controller");
const nestjs_pino_1 = require("nestjs-pino");
const helpers_1 = require("../common/helpers");
const offer_edit_menu_controller_1 = require("../offer-edit-menu/offer-edit-menu.controller");
const arb_edit_menu_controller_1 = require("../arb-edit-menu/arb-edit-menu.controller");
let globalComposer = class globalComposer extends interfaces_1.BaseComposer {
    constructor(globalService, AppConfigService, offerController, OfferEditMenuController, ArbEditMenuController, AppEventsController, logger) {
        super();
        this.globalService = globalService;
        this.AppConfigService = AppConfigService;
        this.offerController = offerController;
        this.OfferEditMenuController = OfferEditMenuController;
        this.ArbEditMenuController = ArbEditMenuController;
        this.AppEventsController = AppEventsController;
        this.logger = logger;
        this.mode = this.AppConfigService.get('node_env');
        this.url = this.AppConfigService.get('url');
        this.menu = this.offerController.getMiddleware();
        this.menu1 = this.OfferEditMenuController.getMiddleware();
        this.menu2 = this.ArbEditMenuController.getMiddleware();
        this.start = async (ctx) => {
            const user = await this.globalService.fetchUser(ctx);
            ctx.i18n.locale(user.locale);
            ctx.session.step = interfaces_1.BotStep.default;
            ctx.session.user.acceptedRules = user.acceptedRules;
            await ctx.reply(ctx.i18n.t('start'), { reply_markup: (0, keyboards_1.mainKeyboard)(ctx) });
        };
        this.back = async (ctx) => {
            ctx.session.step = interfaces_1.BotStep.default;
            await ctx.reply(ctx.i18n.t('start'), { reply_markup: (0, keyboards_1.mainKeyboard)(ctx) });
        };
        this.offers = async (ctx) => {
            const imageurl = this.mode === 'development' ? 'https://picsum.photos/200/300' : this.url + '/media/04.jpg';
            await ctx.replyWithPhoto(imageurl, { caption: ctx.i18n.t('offerMenu'), reply_markup: (0, keyboards_1.offerKeyboard)(ctx) });
        };
        this.createOffer = async (ctx) => {
            ctx.session.step = ctx.session.user.acceptedRules ? interfaces_1.BotStep.roles : interfaces_1.BotStep.rules;
            const message = ctx.session.user.acceptedRules ? ctx.i18n.t('askRole') : ctx.i18n.t('offerWarning');
            await ctx.cleanReplySave(message, { reply_markup: this.offerController.getMiddleware() });
        };
        this.arbitraries = async (ctx) => {
            const imageurl = this.mode == 'development' ? 'https://picsum.photos/200/300' : this.url + '/media/03.jpg';
            await ctx.replyWithPhoto(imageurl, { caption: ctx.i18n.t('arbitraries'), reply_markup: (0, keyboards_1.arbitraryKeyboard)(ctx) });
        };
        this.allOffers = async (ctx) => {
            const offers = await this.globalService.fetchOffers(ctx.from.id);
            if (offers.length) {
                await ctx.reply(ctx.i18n.t('offerHistory') + (0, helpers_1.getOffersMessage)(offers, ctx.from.id));
                ctx.session.step = interfaces_1.BotStep.offer;
            }
            else {
                await ctx.reply(ctx.i18n.t('noData'));
            }
        };
        this.activeOffers = async (ctx) => {
            const offers = await this.globalService.fetchActiveOffers(ctx.from.id);
            if (offers.length) {
                await ctx.reply(ctx.i18n.t('offerHistory') + (0, helpers_1.getOffersMessage)(offers, ctx.from.id));
                ctx.session.step = interfaces_1.BotStep.offer;
            }
            else {
                await ctx.reply(ctx.i18n.t('noData'));
            }
        };
        this.activeArbitraries = async (ctx) => {
            const arbitraries = await this.globalService.fetchActiveArbs(ctx.from.id);
            if (arbitraries.length) {
                await ctx.reply((0, helpers_1.getArbMessage)(arbitraries, ctx.from.id, ctx.i18n.locale()));
                ctx.session.step = interfaces_1.BotStep.arbitrary;
            }
            else {
                await ctx.reply(ctx.i18n.t('noData'));
            }
        };
        this.allArbitraries = async (ctx) => {
            const arbitraries = await this.globalService.fetchAllArbs(ctx.from.id);
            if (arbitraries.length) {
                await ctx.reply((0, helpers_1.getArbMessage)(arbitraries, ctx.from.id, ctx.i18n.locale()));
                ctx.session.step = interfaces_1.BotStep.arbitrary;
            }
            else {
                await ctx.reply(ctx.i18n.t('noData'));
            }
        };
        this.account = async (ctx) => {
            await ctx.reply(ctx.i18n.t('account'), { reply_markup: (0, keyboards_1.accountKeyboard)(ctx) });
        };
        this.web = async (ctx) => {
            const user = await this.globalService.fetchUser(ctx);
            const url = this.mode == 'development' ? `http://localhost:3001` : this.url;
            if (user.password) {
                await ctx.reply(ctx.i18n.t('accountWebLink', { link: `${url}/#login` }), { parse_mode: 'HTML' });
            }
            else {
                const password = await this.globalService.createUserPassword(user);
                const login = ctx.from.id;
                await ctx.reply(ctx.i18n.t('accountWebLink', { link: `${url}/#login?p=${password}&l=${login}` }) + '\n' + ctx.i18n.t('accountWebCreds', { pass: password, login: login }), { parse_mode: "HTML" });
            }
        };
        this.rules = async (ctx) => await ctx.reply(ctx.i18n.t('rules'));
        this.instructions = async (ctx) => await ctx.reply(ctx.i18n.t('instructions'));
        this.info = async (ctx) => await ctx.reply(ctx.i18n.t('info'));
        this.findUser = async (ctx) => await ctx.reply(ctx.i18n.t('findUserInfo'), { reply_markup: (0, keyboards_1.findUserMenu)(ctx) });
        this.changeLang = async (ctx) => await ctx.reply(ctx.i18n.t('languageGroup'), { reply_markup: (0, keyboards_1.languageMenu)(ctx) });
        this.inline_query = async (ctx) => {
            const users = await this.globalService.fetchQueryUsers(ctx.inlineQuery.query);
            await ctx.answerInlineQuery((0, helpers_1.usersQueryMessage)(users));
        };
        this.callbackHandler = async (ctx) => {
            const data = new interfaces_1.OfferCallbackData(ctx.update.callback_query.data);
            if (data.type == 'offer') {
            }
            if (data.action == 'admit') {
                if (data.mode == 'default') {
                    await ctx.deleteMessage();
                    const offer = await this.globalService.createOffer(ctx);
                    await this.AppEventsController.offerCreated(offer, String(ctx.from.id));
                }
                else if (data.mode == 'edit') {
                    await ctx.deleteMessage();
                    await this.AppEventsController.offerAccepted(data.payload);
                }
                await ctx.reply(ctx.i18n.t('offerCreated'));
            }
            else if (data.action == 'edit') {
                if (data.mode == 'default') {
                    ctx.session.step = interfaces_1.BotStep.roles;
                    await ctx.cleanReplySave(ctx.i18n.t('askRole'), { reply_markup: this.offerController.getMiddleware() });
                }
                else if (data.mode == 'edit') {
                    await ctx.deleteMessage();
                    await this.AppEventsController.offerEditInitiated(data.payload, ctx);
                }
            }
            else if (data.action == 'reject') {
                if (data.mode == 'default') {
                    ctx.session.step = interfaces_1.BotStep.default;
                    await ctx.deleteMessage();
                    await ctx.reply(ctx.i18n.t('start'), { reply_markup: (0, keyboards_1.mainKeyboard)(ctx) });
                }
                else if (data.mode == 'edit') {
                    await ctx.deleteMessage();
                    await this.AppEventsController.offerRejectInitiated(data.payload, ctx);
                }
            }
            else if (data.action == 'feedback') {
                if (data.mode == 'positive') {
                    ctx.session.step = interfaces_1.BotStep.setFeedbackP;
                }
                else {
                    ctx.session.step = interfaces_1.BotStep.setFeedbackN;
                }
                await ctx.reply(ctx.i18n.t('askFeedbackText'));
            }
            else if (data.type == 'lang') {
                const locale = data.payload;
                ctx.i18n.locale(locale);
                await this.globalService.updateLocale(ctx.from.id, locale);
                return ctx.reply(ctx.i18n.t('langChanged'), { reply_markup: (0, keyboards_1.accountKeyboard)(ctx) });
            }
        };
    }
};
__decorate([
    (0, decorators_1.Use)(),
    __metadata("design:type", Object)
], globalComposer.prototype, "menu", void 0);
__decorate([
    (0, decorators_1.Use)(),
    __metadata("design:type", Object)
], globalComposer.prototype, "menu1", void 0);
__decorate([
    (0, decorators_1.Use)(),
    __metadata("design:type", Object)
], globalComposer.prototype, "menu2", void 0);
__decorate([
    (0, decorators_1.Command)('start'),
    __metadata("design:type", Function)
], globalComposer.prototype, "start", void 0);
__decorate([
    (0, decorators_1.Hears)('back'),
    __metadata("design:type", Function)
], globalComposer.prototype, "back", void 0);
__decorate([
    (0, decorators_1.Hears)('offers'),
    __metadata("design:type", Function)
], globalComposer.prototype, "offers", void 0);
__decorate([
    (0, decorators_1.Hears)('createOffer'),
    __metadata("design:type", Function)
], globalComposer.prototype, "createOffer", void 0);
__decorate([
    (0, decorators_1.Hears)('arbitraries'),
    __metadata("design:type", Function)
], globalComposer.prototype, "arbitraries", void 0);
__decorate([
    (0, decorators_1.Hears)('allOffers'),
    __metadata("design:type", Object)
], globalComposer.prototype, "allOffers", void 0);
__decorate([
    (0, decorators_1.Hears)('activeOffers'),
    __metadata("design:type", Object)
], globalComposer.prototype, "activeOffers", void 0);
__decorate([
    (0, decorators_1.Hears)('activeArbitraries'),
    __metadata("design:type", Function)
], globalComposer.prototype, "activeArbitraries", void 0);
__decorate([
    (0, decorators_1.Hears)('allArbitraries'),
    __metadata("design:type", Function)
], globalComposer.prototype, "allArbitraries", void 0);
__decorate([
    (0, decorators_1.Hears)('account'),
    __metadata("design:type", Function)
], globalComposer.prototype, "account", void 0);
__decorate([
    (0, decorators_1.Hears)('accountWeb'),
    __metadata("design:type", Function)
], globalComposer.prototype, "web", void 0);
__decorate([
    (0, decorators_1.Hears)('rules'),
    __metadata("design:type", Function)
], globalComposer.prototype, "rules", void 0);
__decorate([
    (0, decorators_1.Hears)('instructions'),
    __metadata("design:type", Function)
], globalComposer.prototype, "instructions", void 0);
__decorate([
    (0, decorators_1.Hears)('info'),
    __metadata("design:type", Function)
], globalComposer.prototype, "info", void 0);
__decorate([
    (0, decorators_1.Hears)('findUser'),
    __metadata("design:type", Function)
], globalComposer.prototype, "findUser", void 0);
__decorate([
    (0, decorators_1.Hears)('changeLang'),
    __metadata("design:type", Function)
], globalComposer.prototype, "changeLang", void 0);
__decorate([
    (0, decorators_1.On)('inline_query'),
    __metadata("design:type", Function)
], globalComposer.prototype, "inline_query", void 0);
__decorate([
    (0, decorators_1.On)("callback_query:data"),
    __metadata("design:type", Object)
], globalComposer.prototype, "callbackHandler", void 0);
globalComposer = __decorate([
    decorators_1.ComposerController,
    __param(6, (0, nestjs_pino_1.InjectPinoLogger)('globalComposer')),
    __metadata("design:paramtypes", [global_service_1.globalService,
        app_config_service_1.AppConfigService,
        offer_controller_1.offerController,
        offer_edit_menu_controller_1.OfferEditMenuController,
        arb_edit_menu_controller_1.ArbEditMenuController,
        app_events_controller_1.AppEventsController,
        nestjs_pino_1.PinoLogger])
], globalComposer);
exports.globalComposer = globalComposer;
//# sourceMappingURL=global.composer.js.map