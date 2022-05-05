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
exports.BtcCoreController = void 0;
const common_1 = require("@nestjs/common");
const Arbitraries_1 = require("../../mikroorm/entities/Arbitraries");
const Offers_1 = require("../../mikroorm/entities/Offers");
const interfaces_1 = require("../../types/interfaces");
const btc_core_service_1 = require("./btc-core.service");
const app_config_service_1 = require("../../app-config/app-config.service");
const nestjs_pino_1 = require("nestjs-pino");
const uuidv4_1 = require("uuidv4");
const app_events_controller_1 = require("../../app-events/app-events.controller");
const Invoices_1 = require("../../mikroorm/entities/Invoices");
const helpers_1 = require("../../bot/common/helpers");
const Client = require('bitcoin-core');
let BtcCoreController = class BtcCoreController extends interfaces_1.BasePaymentController {
    constructor(logger, btcCoreService, AppConfigService, AppEventsController) {
        super();
        this.logger = logger;
        this.btcCoreService = btcCoreService;
        this.AppConfigService = AppConfigService;
        this.AppEventsController = AppEventsController;
        this.init = async () => {
            try {
                this.options = {
                    wallet: this.AppConfigService.get('BTC_WALLET') || '11',
                    btc_password: this.AppConfigService.get('BTC_PASSWORD') || 'bitcoinpassword',
                    btc_user: this.AppConfigService.get('BTC_USER') || 'bitcoinuser',
                    network: this.AppConfigService.get('BTC_NETWORK') || 'testnet',
                    btc_port: this.AppConfigService.get('BTC_PORT') || 18332,
                    confirmations: this.AppConfigService.get('BTC_CONFIRMATIONS') || 0,
                    updateTimeout: this.AppConfigService.get('BTC_UPDATE_TIMEOUT') * 1000 || 5000,
                    incomingTimeout: this.AppConfigService.get('BTC_INCOMING_TIMEOUT') * 1000 || 10 * 60 * 1000,
                    outgoingTimeout: this.AppConfigService.get('BTC_OUTGOING_TIMEOUT') * 1000 || 10 * 60 * 1000,
                };
                this.client = new Client({ network: this.options.network, port: this.options.btc_port, password: this.options.btc_password, username: this.options.btc_user, wallet: this.options.wallet });
                await this.client.ping();
                const state = await this.btcCoreService.checkMoneyConvert();
                if (!state)
                    throw new Error("Money convert service is not accesible");
                this.worker();
            }
            catch (error) {
                this.logger.error(`BtcCoreController init failed! ${error}`);
                process.exit(1);
            }
        };
        this.worker = async () => {
            const invoices = await this.btcCoreService.fetchMatchingInvoices(this.options.incomingTimeout, this.options.outgoingTimeout);
            for (const i of invoices.incoming) {
                const receivedAmount = await this.client.getReceivedByLabel(i.txnId, Number(this.options.confirmations));
                if (typeof receivedAmount == 'number' && receivedAmount >= i.value) {
                    await this.AppEventsController.offerPayed(i.txnId);
                    this.logger.info(`Payment received txnId: ${i.txnId} value: ${i.value}`);
                }
            }
            for (const i of invoices.outgoing) {
                const transactionDetails = await this.client.getTransaction(i.txnId);
                if (typeof transactionDetails == 'object' && transactionDetails.confirmations >= this.options.confirmations) {
                    await this.AppEventsController.offerPayoutProcessed(i.txnId);
                    this.logger.info(`Payment sent txnId: ${i.txnId} value: ${i.value}`);
                }
            }
            setTimeout(this.worker, this.options.updateTimeout);
        };
        this.getPayLink = async (offer) => {
            const txn_id = (0, uuidv4_1.uuid)();
            const url = await this.client.getNewAddress(txn_id);
            await this.btcCoreService.createIncomingTransaction(offer, txn_id, url);
            return { url: url, id: txn_id };
        };
        this.sellerWithdraw = async (offer) => {
            const sellerPayout = (0, helpers_1.getInvoiceValue)(offer.invoices) + (0, helpers_1.getInvoiceFee)(offer.invoices) * (offer.feePayer == Offers_1.OffersFeePayer.BUYER ? 0 : -1);
            await this.withDraw(sellerPayout, offer.sellerWalletData, Invoices_1.InvoicesType.OUT, offer.id, 'BTC');
        };
        this.arbitraryWithdraw = async (arb) => {
            const totalValue = (0, helpers_1.getInvoiceValue)(arb.offer.invoices);
            const sellerPayout = totalValue * arb.sellerPayout / 100;
            const buyerPayout = totalValue * arb.buyerPayout / 100;
            const timeout = arb.status == Arbitraries_1.ArbitrariesStatus.CLOSED ? 12 * 60 * 60 * 1000 : 0;
            setTimeout(async () => {
                const isAllOk = await this.btcCoreService.getArbState(arb);
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
        this.withDraw = async (amount, address, type, offerId, currency = 'BTC') => {
            const response = await this.client.sendToAddress(address, amount);
            await this.btcCoreService.createInvoice({ type: type, currency: currency, value: amount, txnId: response, offer: { id: offerId } });
        };
    }
};
BtcCoreController = __decorate([
    (0, common_1.Controller)(),
    __param(0, (0, nestjs_pino_1.InjectPinoLogger)('BtcCoreController')),
    __metadata("design:paramtypes", [nestjs_pino_1.PinoLogger,
        btc_core_service_1.BtcCoreService,
        app_config_service_1.AppConfigService,
        app_events_controller_1.AppEventsController])
], BtcCoreController);
exports.BtcCoreController = BtcCoreController;
//# sourceMappingURL=btc-core.controller.js.map