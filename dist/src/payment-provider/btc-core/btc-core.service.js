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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BtcCoreService = void 0;
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
const Invoices_1 = require("../../mikroorm/entities/Invoices");
const Offers_1 = require("../../mikroorm/entities/Offers");
const axios_1 = __importDefault(require("axios"));
const Arbitraries_1 = require("../../mikroorm/entities/Arbitraries");
let BtcCoreService = class BtcCoreService {
    constructor(em) {
        this.em = em;
        this.rubToBTC = async (rub) => {
            const response = await axios_1.default.get('https://cdn.moneyconvert.net/api/latest.json');
            if (Array.isArray(rub)) {
                return rub.map(i => ((response.data.rates.BTC / response.data.rates.RUB) * i).toFixed(8));
            }
            else {
                return ((response.data.rates.BTC / response.data.rates.RUB) * rub).toFixed(8);
            }
        };
    }
    async getArbState(oldArb) {
        try {
            const arb = await this.em.findOneOrFail(Arbitraries_1.Arbitraries, { id: oldArb.id });
            if (!(arb.status === Arbitraries_1.ArbitrariesStatus.CLOSEDF && oldArb.status === Arbitraries_1.ArbitrariesStatus.CLOSED)) {
                arb.status = Arbitraries_1.ArbitrariesStatus.CLOSEDF;
                await this.em.persistAndFlush(arb);
                return true;
            }
            return false;
        }
        catch (error) {
            return false;
        }
    }
    async createIncomingTransaction(offer, txn_id, url) {
        const feeRub = Math.max(offer.offerValue * offer.paymentMethod.feePercent / 100, offer.paymentMethod.feeRaw);
        const priceRub = offer.offerValue + feeRub * (offer.feePayer === Offers_1.OffersFeePayer.BUYER ? 1 : 0);
        const valuesBtc = await this.rubToBTC([feeRub, priceRub]);
        await this.createInvoice({ type: Invoices_1.InvoicesType.IN, currency: 'BTC', value: Number(valuesBtc[1]), url: url, fee: Number(valuesBtc[0]), txnId: txn_id, offer: { id: offer.id } });
    }
    async createInvoice(options) {
        options.invoiceStatus = { value: 'waiting' };
        await this.em.nativeInsert(Invoices_1.Invoices, options);
    }
    async fetchMatchingInvoices(incomingTimeout, outgoingTimeout) {
        const allInvoices = await this.em.find(Invoices_1.Invoices, {
            currency: 'BTC',
            invoiceStatus: { value: 'waiting' }
        });
        return {
            incoming: allInvoices.filter(i => i.createdAt > new Date(Date.now() - incomingTimeout)),
            outgoing: allInvoices.filter(i => i.createdAt > new Date(Date.now() - outgoingTimeout))
        };
    }
    async checkMoneyConvert() {
        try {
            const response = await axios_1.default.get('https://cdn.moneyconvert.net/api/latest.json');
            if (response.data && response.data.rates)
                return true;
        }
        catch (error) {
            return false;
        }
    }
};
BtcCoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.EntityManager])
], BtcCoreService);
exports.BtcCoreService = BtcCoreService;
//# sourceMappingURL=btc-core.service.js.map