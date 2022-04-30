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
exports.CoinPayService = void 0;
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
const Invoices_1 = require("../../mikroorm/entities/Invoices");
const uuidv4_1 = require("uuidv4");
const app_config_service_1 = require("../../app-config/app-config.service");
const axios_1 = __importDefault(require("axios"));
const Arbitraries_1 = require("../../mikroorm/entities/Arbitraries");
let CoinPayService = class CoinPayService {
    constructor(em, AppConfigService) {
        this.em = em;
        this.AppConfigService = AppConfigService;
    }
    async createCardTransaction(amount, address) {
        const bodyFormData = new FormData();
        bodyFormData.append('cardNumber', address);
        const cardCode = await axios_1.default.post('https://qiwi.com/card/detect.action', bodyFormData);
        if (cardCode.data.code.value == 0) {
            const body = {
                "id": Date.now().toString(),
                "sum": {
                    "amount": amount,
                    "currency": "643"
                },
                "paymentMethod": {
                    "type": "Account",
                    "accountId": "643"
                },
                "fields": {
                    "account": address
                }
            };
            const response = await axios_1.default.post(`https://edge.qiwi.com/sinap/api/v2/terms/${cardCode}/payments`, body, {
                headers: {
                    'Authorization': `Bearer ${this.AppConfigService.get('QIWI_API_TOKEN')}`
                }
            });
            return response.data.transaction.id;
        }
    }
    async createInvoice(options) {
        options.invoiceStatus = { value: 'waiting' };
        await this.em.nativeInsert(Invoices_1.Invoices, options);
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
    async createQiwiTransaction(amount, address) {
        const body = {
            "id": (0, uuidv4_1.uuid)(),
            "sum": {
                "amount": amount,
                "currency": "643"
            },
            "paymentMethod": {
                "type": "Account",
                "accountId": "643"
            },
            "fields": {
                "account": address
            }
        };
        const response = await axios_1.default.post(`https://edge.qiwi.com/sinap/api/v2/terms/99/payments`, body, {
            headers: { 'Authorization': `Bearer ${this.AppConfigService.get('QIWI_API_TOKEN')}` }
        });
        return response.data.transaction.id;
    }
};
CoinPayService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.EntityManager,
        app_config_service_1.AppConfigService])
], CoinPayService);
exports.CoinPayService = CoinPayService;
//# sourceMappingURL=coin-pay.service.js.map