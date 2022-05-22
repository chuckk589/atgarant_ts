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
exports.ArbitraryService = void 0;
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
const Arbitraries_1 = require("../mikroorm/entities/Arbitraries");
const telegram_gateway_1 = require("../telegram/telegram.gateway");
const app_events_controller_1 = require("../app-events/app-events.controller");
let ArbitraryService = class ArbitraryService {
    constructor(em, telegramGateway, AppEventsController) {
        this.em = em;
        this.telegramGateway = telegramGateway;
        this.AppEventsController = AppEventsController;
    }
    async disputeArb(id, DisputeArbDto) {
        return await this.AppEventsController.arbDisputed(id, DisputeArbDto.chatId);
    }
    async closeArb(id, arbData) {
        return await this.AppEventsController.arbClosed(id, arbData);
    }
    async getHistory(id) {
        return await this.telegramGateway.getChatHistory(Number(id));
    }
    async findAll(userId) {
        const options = userId
            ? {
                offer: {
                    $or: [{ partner: { id: Number(userId) } }, { initiator: { id: Number(userId) } }],
                },
            }
            : {};
        return await this.em.find(Arbitraries_1.Arbitraries, options, { populate: ['offer.initiator', 'offer.partner', 'arbiter'] });
    }
};
ArbitraryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.EntityManager,
        telegram_gateway_1.TelegramGateway,
        app_events_controller_1.AppEventsController])
], ArbitraryService);
exports.ArbitraryService = ArbitraryService;
//# sourceMappingURL=arbitrary.service.js.map