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
exports.routerService = void 0;
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
const Users_1 = require("../../mikroorm/entities/Users");
const app_config_service_1 = require("../../app-config/app-config.service");
const Offers_1 = require("../../mikroorm/entities/Offers");
const helpers_1 = require("../common/helpers");
const Arbitraries_1 = require("../../mikroorm/entities/Arbitraries");
let routerService = class routerService {
    constructor(em, appConfigService) {
        this.em = em;
        this.appConfigService = appConfigService;
    }
    async fetchArb(id, chatId) {
        const arb = await this.em.findOneOrFail(Arbitraries_1.Arbitraries, {
            id: id,
            offer: {
                $or: [{ initiator: { chatId: String(chatId) } }, { partner: { chatId: String(chatId) } }],
            },
        }, { populate: ['offer.initiator', 'offer.partner', 'offer.paymentMethod', 'offer.invoices'] });
        return arb;
    }
    async fetchOffer(id, chatId) {
        const offer = await this.em.findOne(Offers_1.Offers, {
            id: id,
            $or: [{ initiator: { chatId: String(chatId) } }, { partner: { chatId: String(chatId) } }],
        }, { populate: ['initiator', 'partner', 'invoices', 'reviews.recipient', 'reviews.author'] });
        this.em.clear();
        return offer;
    }
    async fetchContact(ctx) {
        const user = await this.em.findOne(Users_1.Users, {
            $or: [{ chatId: ctx.message.text }, { username: ctx.message.text.replace('@', '') }],
        });
        return user;
    }
    async setWallet(ctx) {
        const _isSeller = (0, helpers_1.isSeller)(ctx);
        ctx.session.editedOffer[_isSeller ? 'sellerWalletData' : 'buyerWalletData'] = ctx.message.text;
        await this.em.nativeUpdate(Offers_1.Offers, { id: ctx.session.editedOffer.id }, { [_isSeller ? 'sellerWalletData' : 'buyerWalletData']: ctx.message.text });
    }
};
routerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.EntityManager, app_config_service_1.AppConfigService])
], routerService);
exports.routerService = routerService;
//# sourceMappingURL=router.service.js.map