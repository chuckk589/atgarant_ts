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
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const interfaces_1 = require("../types/interfaces");
let AppConfigService = class AppConfigService {
    constructor(configService, any) {
        this.configService = configService;
    }
    get(key, options) {
        return this.configService.get(key, options) || this.configService.get(key.toUpperCase(), options);
    }
    get payments() {
        const keys = Object.keys(process.env).filter((k) => k.includes('paymentMethod'));
        const operationMode = this.get('PAYMENT_SERVICE');
        return operationMode == 'btc-core'
            ? keys.map((k) => new interfaces_1.PM(k.split('_').pop(), process.env[k])).filter((p) => p.method == 'BTC')
            : keys.map((k) => new interfaces_1.PM(k.split('_').pop(), process.env[k]));
    }
    offerStatus(idOrValue) {
        const statuses = Object.keys(process.env)
            .filter((k) => k.includes('offerStatus'))
            .map((k) => new interfaces_1.CommonConfig(k.split('_').pop(), process.env[k]));
        return typeof idOrValue == 'number'
            ? statuses.find((s) => s.id === idOrValue)
            : statuses.find((s) => s.value === String(idOrValue) || s.name === String(idOrValue));
    }
    invoiceStatus(idOrValue) {
        const statuses = Object.keys(process.env)
            .filter((k) => k.includes('invoiceStatus'))
            .map((k) => new interfaces_1.CommonConfig(k.split('_').pop(), process.env[k]));
        return typeof idOrValue == 'number'
            ? statuses.find((s) => s.id === idOrValue)
            : statuses.find((s) => s.value === String(idOrValue));
    }
};
AppConfigService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('test')),
    __metadata("design:paramtypes", [config_1.ConfigService, Object])
], AppConfigService);
exports.AppConfigService = AppConfigService;
//# sourceMappingURL=app-config.service.js.map