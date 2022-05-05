import { EntityData, EntityManager } from '@mikro-orm/core';
import { Invoices } from 'src/mikroorm/entities/Invoices';
import { Offers } from 'src/mikroorm/entities/Offers';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Arbitraries } from 'src/mikroorm/entities/Arbitraries';
declare type InvoicesResponse = {
    incoming: Invoices[];
    outgoing: Invoices[];
};
export declare class BtcCoreService {
    private readonly em;
    private readonly AppConfigService;
    constructor(em: EntityManager, AppConfigService: AppConfigService);
    getArbState(oldArb: Arbitraries): Promise<boolean>;
    createIncomingTransaction(offer: Offers, txn_id: string, url: string): Promise<void>;
    createInvoice(options: EntityData<Invoices>): Promise<void>;
    fetchMatchingInvoices(incomingTimeout: number, outgoingTimeout: number): Promise<InvoicesResponse>;
    private rubToBTC;
    checkMoneyConvert(): Promise<boolean>;
}
export {};
