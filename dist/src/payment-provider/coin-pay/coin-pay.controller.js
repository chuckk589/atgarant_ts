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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinPayController = void 0;
const common_1 = require("@nestjs/common");
const coinpayments_1 = __importDefault(require("coinpayments"));
const nestjs_pino_1 = require("nestjs-pino");
const Offers_1 = require("../../mikroorm/entities/Offers");
const Invoices_1 = require("../../mikroorm/entities/Invoices");
const Arbitraries_1 = require("../../mikroorm/entities/Arbitraries");
const interfaces_1 = require("../../types/interfaces");
const coin_pay_service_1 = require("./coin-pay.service");
const app_config_service_1 = require("../../app-config/app-config.service");
const helpers_1 = require("../../bot/common/helpers");
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');
let CoinPayController = class CoinPayController extends interfaces_1.BasePaymentController {
    constructor(logger, coinPayService, AppConfigService) {
        super();
        this.logger = logger;
        this.coinPayService = coinPayService;
        this.AppConfigService = AppConfigService;
        this.init = async () => {
            try {
                this.options = {
                    coin_api_key: this.AppConfigService.get('COIN_API_KEY'),
                    coin_api_key_secret: this.AppConfigService.get('COIN_API_KEY_SECRET'),
                    qiwi_p2p_token_secret: this.AppConfigService.get('QIWI_P2P_TOKEN_SECRET'),
                };
                this.client = new coinpayments_1.default({ key: this.options.coin_api_key, secret: this.options.coin_api_key_secret });
                this.qiwiApi = new QiwiBillPaymentsAPI(this.options.qiwi_p2p_token_secret);
            }
            catch (error) {
                this.logger.error('CoinPayController init failed!');
                process.exit(1);
            }
        };
        this.rubToCurrency = async (rub, code) => {
            const data = await this.client.rates();
            if (Array.isArray(rub)) {
                return rub.map(i => ((Number(data.RUB.rate_btc) / Number(data[code].rate_btc)) * i).toFixed(8));
            }
            else {
                return ((Number(data.RUB.rate_btc) / Number(data[code].rate_btc)) * rub).toFixed(8);
            }
        };
        this.getPayLink = async (offer) => {
            const feeRub = Math.max(offer.offerValue * offer.paymentMethod.feePercent / 100, offer.paymentMethod.feeRaw);
            const priceRub = offer.offerValue + feeRub * (offer.feePayer === Offers_1.OffersFeePayer.BUYER ? 1 : 0);
            const currency = offer.paymentMethod.value.split('_').pop();
            if (this.AppConfigService.get('node_env') == 'debug') {
                await this.coinPayService.mockTransaction({ type: Invoices_1.InvoicesType.IN, currency, value: offer.offerValue, fee: feeRub, offer: offer.id });
                return { url: 'test url', id: 'id' };
            }
            if (currency == 'QIWI' || currency == 'CARD') {
                const method = currency === 'QIWI' ? 'qw' : 'card';
                const billId = this.qiwiApi.generateId();
                const response = await this.qiwiApi.createBill(billId, { amount: priceRub, currency: 'RUB', comment: `Заказ id: ${offer.id}`, customFields: { paySourcesFilter: method } });
                await this.coinPayService.createInvoice({ type: Invoices_1.InvoicesType.IN, currency: currency, value: response.amount.value, fee: feeRub, txnId: response.billId, url: response.payUrl, offer: { id: offer.id } });
                return { url: response.payUrl, id: response.billId };
            }
            else {
                const feeCrypto = await this.rubToCurrency(feeRub, currency);
                const CoinpaymentsCreateTransactionOpts = { currency1: 'RUB', currency2: currency, buyer_email: 'chuckk589@gmail.com', amount: priceRub };
                const response = await this.client.createTransaction(CoinpaymentsCreateTransactionOpts);
                await this.coinPayService.createInvoice({ type: Invoices_1.InvoicesType.IN, currency: currency, value: Number(response.amount), fee: Number(feeCrypto), txnId: response.txn_id, url: response.checkout_url, offer: { id: offer.id } });
                return { url: response.checkout_url, id: response.txn_id };
            }
        };
        this.withDraw = async (amount, address, type, offerId, currency) => {
            if (this.AppConfigService.get('node_env') == 'debug') {
                await this.coinPayService.mockTransaction({ type: type, currency: currency, value: amount, offer: offerId });
                return;
            }
            if (currency === 'QIWI') {
                const qiwiResponse = await this.coinPayService.createQiwiTransaction(amount, address);
                await this.coinPayService.createInvoice({ type: type, currency: currency, value: amount, txnId: qiwiResponse, offer: { id: offerId } });
            }
            else if (currency === 'CARD') {
                const id = await this.coinPayService.createCardTransaction(amount, address);
                await this.coinPayService.createInvoice({ type: type, currency: currency, value: amount, txnId: id, offer: { id: offerId } });
            }
            else {
                const CoinpaymentsCreateWithdrawalOpts = { amount: amount, currency: currency, address: address };
                const response = await this.client.createWithdrawal(CoinpaymentsCreateWithdrawalOpts);
                await this.coinPayService.createInvoice({ type: type, currency: currency, value: Number(response.amount), txnId: response.id, offer: { id: offerId } });
            }
        };
        this.sellerWithdraw = async (offer) => {
            const sellerPayout = (0, helpers_1.getInvoiceValue)(offer.invoices) + (0, helpers_1.getInvoiceFee)(offer.invoices) * (offer.feePayer == Offers_1.OffersFeePayer.BUYER ? 0 : -1);
            const currency = offer.paymentMethod.value.split('_').pop();
            await this.withDraw(sellerPayout, offer.sellerWalletData, Invoices_1.InvoicesType.OUT, offer.id, currency);
        };
        this.arbitraryWithdraw = async (arb) => {
            const totalValue = (0, helpers_1.getInvoiceValue)(arb.offer.invoices);
            const sellerPayout = totalValue * arb.sellerPayout / 100;
            const buyerPayout = totalValue * arb.buyerPayout / 100;
            const timeout = arb.status == Arbitraries_1.ArbitrariesStatus.CLOSED ? 12 * 60 * 60 * 1000 : 0;
            setTimeout(async () => {
                const isAllOk = await this.coinPayService.getArbState(arb);
                if (isAllOk) {
                    const currency = arb.offer.paymentMethod.value.split('_').pop();
                    if (sellerPayout) {
                        await this.withDraw(sellerPayout, arb.offer.sellerWalletData, Invoices_1.InvoicesType.REFUND, arb.offer.id, currency);
                    }
                    if (buyerPayout) {
                        await this.withDraw(buyerPayout, arb.offer.buyerWalletData, Invoices_1.InvoicesType.REFUND, arb.offer.id, currency);
                    }
                }
            }, timeout);
        };
    }
};
CoinPayController = __decorate([
    (0, common_1.Controller)(),
    __param(0, (0, nestjs_pino_1.InjectPinoLogger)('CoinPayController')),
    __metadata("design:paramtypes", [nestjs_pino_1.PinoLogger,
        coin_pay_service_1.CoinPayService,
        app_config_service_1.AppConfigService])
], CoinPayController);
exports.CoinPayController = CoinPayController;
//# sourceMappingURL=coin-pay.controller.js.map