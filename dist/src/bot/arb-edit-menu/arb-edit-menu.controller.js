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
exports.ArbEditMenuController = void 0;
const interfaces_1 = require("../../types/interfaces");
const decorators_1 = require("../common/decorators");
const menu_1 = require("@grammyjs/menu");
const app_events_controller_1 = require("../../app-events/app-events.controller");
const Arbitraries_1 = require("../../mikroorm/entities/Arbitraries");
const nestjs_pino_1 = require("nestjs-pino");
let ArbEditMenuController = class ArbEditMenuController extends interfaces_1.BaseMenu {
    constructor(AppEventsController, logger) {
        super();
        this.AppEventsController = AppEventsController;
        this.logger = logger;
        this.menu = new menu_1.Menu("arb-edit-menu")
            .dynamic((ctx, range) => {
            const status = ctx.session.editedArb.status;
            status === Arbitraries_1.ArbitrariesStatus.CLOSED && range.text(ctx.i18n.t('arbitraryDispute'), async (ctx) => {
                try {
                    ctx.session.editedArb.status = await this.AppEventsController.arbDisputed(ctx.session.editedArb, ctx.from.id);
                    await ctx.reply(ctx.i18n.t('arbitraryDisputed'));
                    ctx.menu.update();
                }
                catch (error) {
                    this.logger.error(error);
                    await ctx.reply('arbDisputeFailed');
                }
            });
            return range;
        });
    }
};
__decorate([
    (0, decorators_1.Menu)('arb-edit-menu'),
    __metadata("design:type", Object)
], ArbEditMenuController.prototype, "menu", void 0);
ArbEditMenuController = __decorate([
    decorators_1.MenuController,
    __param(1, (0, nestjs_pino_1.InjectPinoLogger)('ArbEditMenuController')),
    __metadata("design:paramtypes", [app_events_controller_1.AppEventsController,
        nestjs_pino_1.PinoLogger])
], ArbEditMenuController);
exports.ArbEditMenuController = ArbEditMenuController;
//# sourceMappingURL=arb-edit-menu.controller.js.map