import { Arbitraries } from 'src/mikroorm/entities/Arbitraries';
import { Offers } from 'src/mikroorm/entities/Offers';
import { BasePaymentController, paymentURL } from 'src/types/interfaces';
import { BtcCoreService } from './btc-core.service';
import { AppConfigService } from '../../app-config/app-config.service';
import { PinoLogger } from 'nestjs-pino';
import { AppEventsController } from 'src/app-events/app-events.controller';
import { InvoicesType } from 'src/mikroorm/entities/Invoices';
declare type BtcCoreOptions = {
    wallet: string;
    btc_password: string;
    btc_user: string;
    network: 'testnet' | 'mainnet';
    btc_port: number;
    confirmations: number;
    updateTimeout: number;
    incomingTimeout: number;
    outgoingTimeout: number;
};
export declare class BtcCoreController extends BasePaymentController {
    private readonly logger;
    private readonly btcCoreService;
    private readonly AppConfigService;
    private readonly AppEventsController;
    constructor(logger: PinoLogger, btcCoreService: BtcCoreService, AppConfigService: AppConfigService, AppEventsController: AppEventsController);
    options: BtcCoreOptions;
    test: number;
    private client;
    init: () => Promise<void>;
    worker: () => Promise<void>;
    getPayLink: (offer: Offers) => Promise<paymentURL>;
    sellerWithdraw: (offer: Offers) => Promise<void>;
    arbitraryWithdraw: (arb: Arbitraries) => Promise<void>;
    withDraw: (amount: number, address: string, type: InvoicesType, offerId: number, currency?: string) => Promise<void>;
}
export {};
