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
exports.globalService = void 0;
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
const Offers_1 = require("../../mikroorm/entities/Offers");
const Offerstatuses_1 = require("../../mikroorm/entities/Offerstatuses");
const Paymentmethods_1 = require("../../mikroorm/entities/Paymentmethods");
const Users_1 = require("../../mikroorm/entities/Users");
const app_config_service_1 = require("../../app-config/app-config.service");
const Arbitraries_1 = require("../../mikroorm/entities/Arbitraries");
let globalService = class globalService {
    constructor(em, AppConfigService) {
        this.em = em;
        this.AppConfigService = AppConfigService;
    }
    async createUserPassword(user) {
        const password = Math.random().toString(36).substr(2, 11);
        user.password = password;
        await this.em.persistAndFlush(user);
        return password;
    }
    async updateLocale(chatId, locale) {
        await this.em.nativeUpdate(Users_1.Users, { chatId: String(chatId) }, { locale: locale });
    }
    async fetchAllArbs(chatid) {
        const arbs = await this.em.find(Arbitraries_1.Arbitraries, {
            offer: {
                $or: [
                    { initiator: { chatId: String(chatid) } },
                    { partner: { chatId: String(chatid) } }
                ]
            }
        }, { populate: ['offer.initiator', 'offer.partner', 'offer.paymentMethod', 'offer.invoices'] });
        return arbs;
    }
    async fetchActiveArbs(chatid) {
        const arbs = await this.em.find(Arbitraries_1.Arbitraries, {
            offer: {
                $or: [
                    { initiator: { chatId: String(chatid) } },
                    { partner: { chatId: String(chatid) } }
                ]
            }
        }, { populate: ['offer.initiator', 'offer.partner', 'offer.paymentMethod', 'offer.invoices'] });
        return arbs;
    }
    async fetchActiveOffers(chatid) {
        const offers = await this.em.find(Offers_1.Offers, {
            $or: [
                { initiator: { chatId: String(chatid) } },
                { partner: { chatId: String(chatid) } }
            ],
            offerStatus: { value: { $nin: ['closed', 'pending'] } }
        }, { populate: ['initiator', 'partner', 'invoices', 'paymentMethod', 'invoices', 'offerStatus'] });
        return offers;
    }
    async fetchOffers(chatid) {
        const offers = await this.em.find(Offers_1.Offers, {
            $or: [
                { initiator: { chatId: String(chatid) } },
                { partner: { chatId: String(chatid) } }
            ],
        }, { populate: ['initiator', 'partner', 'invoices', 'paymentMethod', 'invoices'] });
        return offers;
    }
    async fetchUser(ctx) {
        let user = await this.em.findOne(Users_1.Users, { chatId: String(ctx.from.id) });
        if (!user) {
            user = this.em.create(Users_1.Users, {
                chatId: String(ctx.from.id),
                username: ctx.from.username,
                firstName: String(ctx.from.first_name)
            });
            await this.em.persistAndFlush(user);
        }
        return user;
    }
    async fetchQueryUsers(payload) {
        const users = await this.em.find(Users_1.Users, {
            $or: [
                { chatId: { $like: String(payload) } },
                { username: { $like: String(payload) } }
            ],
        }, {
            populate: ['profile', 'violations']
        });
        return users;
    }
    async createOffer(ctx) {
        const offerDTO = ctx.session.pendingOffer;
        const offerStatus = this.AppConfigService.offerStatus('pending');
        const newoffer = new Offers_1.Offers();
        newoffer.estimatedShipping = '11.11.2021';
        newoffer.feeBaked = offerDTO.feeBaked;
        newoffer.feePayer = offerDTO.feePayer;
        newoffer.role = offerDTO.role;
        newoffer.offerValue = offerDTO.offerValue;
        newoffer.productDetails = offerDTO.productDetails;
        newoffer.shippingDetails = offerDTO.shippingDetails;
        newoffer.productAdditionalDetails = offerDTO.productAdditionalDetails;
        newoffer.restDetails = offerDTO.restDetails;
        newoffer.refundDetails = offerDTO.refundDetails;
        newoffer.initiator = await this.em.findOneOrFail(Users_1.Users, { chatId: offerDTO.initiator_chatId });
        newoffer.partner = await this.em.findOneOrFail(Users_1.Users, { chatId: offerDTO.partner_chatId });
        newoffer.offerStatus = this.em.getReference(Offerstatuses_1.Offerstatuses, offerStatus.id);
        newoffer.paymentMethod = this.em.getReference(Paymentmethods_1.Paymentmethods, offerDTO.paymentMethodId);
        await this.em.persistAndFlush(newoffer);
        return newoffer;
    }
};
globalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.EntityManager,
        app_config_service_1.AppConfigService])
], globalService);
exports.globalService = globalService;
//# sourceMappingURL=global.service.js.map