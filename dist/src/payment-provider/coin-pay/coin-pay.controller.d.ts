import Coinpayments from 'coinpayments';
import { PinoLogger } from 'nestjs-pino';
import { Offers } from 'src/mikroorm/entities/Offers';
import { InvoicesType } from 'src/mikroorm/entities/Invoices';
import { Arbitraries } from 'src/mikroorm/entities/Arbitraries';
import { BasePaymentController, paymentURL } from 'src/types/interfaces';
import { CoinPayService } from './coin-pay.service';
import { AppConfigService } from '../../app-config/app-config.service';
declare type CoinPayOptions = {
    coin_api_key: string;
    coin_api_key_secret: string;
    qiwi_p2p_token_secret: string;
};
export declare class CoinPayController extends BasePaymentController {
    private readonly logger;
    private readonly coinPayService;
    private readonly AppConfigService;
    init: () => Promise<void>;
    constructor(logger: PinoLogger, coinPayService: CoinPayService, AppConfigService: AppConfigService);
    client: Coinpayments;
    qiwiApi: any;
    options: CoinPayOptions;
    private rubToCurrency;
    getPayLink: (offer: Offers) => Promise<paymentURL>;
    withDraw: (amount: number, address: string, type: InvoicesType, offerId: number, currency: string) => Promise<void>;
    sellerWithdraw: (offer: Offers) => Promise<void>;
    arbitraryWithdraw: (arb: Arbitraries) => Promise<void>;
}
export {};
