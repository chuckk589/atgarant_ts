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
exports.AppEventsService = void 0;
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
const Offers_1 = require("../mikroorm/entities/Offers");
const Users_1 = require("../mikroorm/entities/Users");
const app_config_service_1 = require("../app-config/app-config.service");
const Offerstatuses_1 = require("../mikroorm/entities/Offerstatuses");
const Invoices_1 = require("../mikroorm/entities/Invoices");
const Arbitraries_1 = require("../mikroorm/entities/Arbitraries");
const Reviews_1 = require("../mikroorm/entities/Reviews");
let AppEventsService = class AppEventsService {
    constructor(em, AppConfigService) {
        this.em = em;
        this.AppConfigService = AppConfigService;
    }
    async updateInvoiceStatus(txn_id, status) {
        const invoiceStatus = this.AppConfigService.invoiceStatus(status);
        await this.em.nativeUpdate(Invoices_1.Invoices, { txnId: txn_id }, {
            invoiceStatus: this.em.getReference(Offerstatuses_1.Offerstatuses, invoiceStatus.id),
        });
    }
    async createNewReview(recipientId, authorId, feedback, rate, offerId) {
        const review = this.em.create(Reviews_1.Reviews, {
            author: authorId,
            recipient: recipientId,
            offer: offerId,
            rate: rate,
            text: feedback,
        });
        await this.em.persistAndFlush(review);
    }
    async applyArbUpdate(arbData) {
        await this.em.persistAndFlush(arbData);
    }
    async createNewArbitrary(options) {
        const arb = this.em.create(Arbitraries_1.Arbitraries, {
            reason: options.reason,
            chatId: options.chatData.chat_id,
            status: Arbitraries_1.ArbitrariesStatus.ACTIVE,
            offer: options.offerId,
            initiator: options.issuerId,
            arbiter: this.em.getReference(Users_1.Users, options.moderatorId),
        });
        await this.em.persistAndFlush(arb);
    }
    async closeArbitraryOfferAttempt(offerId) {
        const waitStatus = this.AppConfigService.invoiceStatus('waiting');
        const count = await this.em.findAndCount(Invoices_1.Invoices, { offer: offerId, invoiceStatus: waitStatus.id });
        if (!count[1]) {
            await this.updateOfferStatus(offerId, 'closed');
        }
    }
    async getOfferByTxnId(txn_id) {
        return await this.em.findOne(Offers_1.Offers, { invoices: { txnId: txn_id } }, { populate: ['partner', 'initiator', 'invoices'] });
    }
    async getOfferById(id) {
        const offer = await this.em.findOneOrFail(Offers_1.Offers, { id: id }, { populate: ['partner', 'initiator'] });
        return offer;
    }
    async getArbById(id) {
        const arb = await this.em.findOneOrFail(Arbitraries_1.Arbitraries, { id: id }, { populate: ['offer', 'offer.paymentMethod', 'offer.invoices'] });
        return arb;
    }
    async updateOfferStatus(payload, status) {
        const offerstatus = this.AppConfigService.offerStatus(status);
        let offer;
        if (payload instanceof Offers_1.Offers) {
            offer = payload;
        }
        else if (typeof payload === 'number') {
            offer = this.em.getReference(Offers_1.Offers, payload);
        }
        offer.offerStatus = this.em.getReference(Offerstatuses_1.Offerstatuses, offerstatus.id);
        await this.em.persistAndFlush(offer);
        return offer;
    }
    async getLeastBusyMod() {
        const moderators = await this.em.find(Users_1.Users, { role: 2 }, {
            populate: ['arbs'],
            populateWhere: {
                arbs: {
                    status: {
                        $in: ['active', 'disputed'],
                    },
                },
            },
        });
        const sorted = moderators.sort((a, b) => {
            return a.arbs.length - b.arbs.length;
        });
        return sorted.length ? sorted[0] : undefined;
    }
};
AppEventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.EntityManager, app_config_service_1.AppConfigService])
], AppEventsService);
exports.AppEventsService = AppEventsService;
//# sourceMappingURL=app-events.service.js.map