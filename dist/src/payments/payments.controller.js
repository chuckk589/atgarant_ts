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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const payments_service_1 = require("./payments.service");
const interfaces_1 = require("../types/interfaces");
const coinpayments_dto_1 = require("./dto/coinpayments.dto");
const qiwipayments_dto_1 = require("./dto/qiwipayments.dto");
const app_events_controller_1 = require("../app-events/app-events.controller");
let PaymentsController = class PaymentsController {
    constructor(PaymentController, PaymentsService, AppEventsController) {
        this.PaymentController = PaymentController;
        this.PaymentsService = PaymentsService;
        this.AppEventsController = AppEventsController;
        this.PaymentController.init();
    }
    async cryptoEndPoint(CoinpaymentsDto) {
        if (CoinpaymentsDto.status == 100) {
            await this.PaymentsService.registerPayment(CoinpaymentsDto.txn_id);
            await this.AppEventsController.offerPayed(CoinpaymentsDto.txn_id);
        }
        else if (CoinpaymentsDto.status == 2) {
            await this.PaymentsService.registerPayment(CoinpaymentsDto.txn_id);
            await this.AppEventsController.offerPayoutProcessed(CoinpaymentsDto.txn_id);
        }
    }
    async fiatQIWI(QiwiPaymentDto) {
        const payload = new qiwipayments_dto_1.QiwiPaymentsDto(QiwiPaymentDto);
        if (payload.status === 'PAID') {
            await this.PaymentsService.registerPayment(payload.txnId);
            await this.AppEventsController.offerPayed(payload.txnId);
        }
        else if (payload.status === 'SUCCESS') {
            await this.PaymentsService.registerPayment(payload.txnId);
            await this.AppEventsController.offerPayoutProcessed(payload.txnId);
        }
    }
};
__decorate([
    (0, common_1.Post)('crypto'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coinpayments_dto_1.CoinpaymentsDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "cryptoEndPoint", null);
__decorate([
    (0, common_1.Post)('qiwi'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "fiatQIWI", null);
PaymentsController = __decorate([
    (0, common_1.Controller)('payments'),
    __param(0, (0, common_1.Inject)(constants_1.PAYMENTS_CONTROLLER)),
    __metadata("design:paramtypes", [interfaces_1.BasePaymentController,
        payments_service_1.PaymentsService,
        app_events_controller_1.AppEventsController])
], PaymentsController);
exports.PaymentsController = PaymentsController;
//# sourceMappingURL=payments.controller.js.map