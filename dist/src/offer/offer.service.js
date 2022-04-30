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
exports.OfferService = void 0;
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
const Offers_1 = require("../mikroorm/entities/Offers");
const app_events_controller_1 = require("../app-events/app-events.controller");
let OfferService = class OfferService {
    constructor(em, AppEventsController) {
        this.em = em;
        this.AppEventsController = AppEventsController;
    }
    async update(id, updateOfferDto) {
        return await this.em.nativeUpdate(Offers_1.Offers, {
            id: id
        }, {
            [updateOfferDto.seller ? 'sellerWalletData' : 'buyerWalletData']: updateOfferDto.walletData
        });
    }
    async createArb(id, body) {
        return await this.AppEventsController.arbOpened(Number(id), body.reason, body.initiator);
    }
    async offerAction(id) {
        const offer = await this.em.findOneOrFail(Offers_1.Offers, { id: Number(id) }, { populate: ['partner', 'initiator', 'offerStatus'] });
        if (offer.offerStatus.value == 'payed') {
            return await this.AppEventsController.offerShipped(offer);
        }
        else if (offer.offerStatus.value == 'shipped') {
            return await this.AppEventsController.offerArrived(offer);
        }
        else if (offer.offerStatus.value == 'arrived') {
            return await this.AppEventsController.offerPaymentRequested(offer);
        }
        else if (offer.offerStatus.value == 'pending') {
        }
    }
    async findAll(userId) {
        const options = userId
            ? {
                $or: [
                    { partner: { id: Number(userId) } },
                    { initiator: { id: Number(userId) } }
                ]
            }
            : {};
        return await this.em.find(Offers_1.Offers, options, { populate: ['initiator', 'partner', 'offerStatus', 'paymentMethod', 'reviews'] });
    }
};
OfferService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.EntityManager,
        app_events_controller_1.AppEventsController])
], OfferService);
exports.OfferService = OfferService;
//# sourceMappingURL=offer.service.js.map