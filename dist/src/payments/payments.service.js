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
exports.PaymentsService = void 0;
const core_1 = require("@mikro-orm/core");
const common_1 = require("@nestjs/common");
const Invoices_1 = require("../mikroorm/entities/Invoices");
const Offerstatuses_1 = require("../mikroorm/entities/Offerstatuses");
const app_config_service_1 = require("../app-config/app-config.service");
let PaymentsService = class PaymentsService {
    constructor(em, AppConfigService) {
        this.em = em;
        this.AppConfigService = AppConfigService;
    }
    async registerPayment(txn_id) {
        const status = this.AppConfigService.invoiceStatus('success');
        await this.em.nativeUpdate(Invoices_1.Invoices, { txnId: txn_id }, {
            invoiceStatus: this.em.getReference(Offerstatuses_1.Offerstatuses, status.id),
        });
    }
};
PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.EntityManager, app_config_service_1.AppConfigService])
], PaymentsService);
exports.PaymentsService = PaymentsService;
//# sourceMappingURL=payments.service.js.map