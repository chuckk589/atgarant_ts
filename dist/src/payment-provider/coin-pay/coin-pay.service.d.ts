import { EntityData, EntityManager } from '@mikro-orm/core';
import { Invoices } from 'src/mikroorm/entities/Invoices';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Arbitraries } from 'src/mikroorm/entities/Arbitraries';
export declare class CoinPayService {
    private readonly em;
    private readonly AppConfigService;
    constructor(em: EntityManager, AppConfigService: AppConfigService);
    mockTransaction(options: EntityData<Invoices>): Promise<void>;
    createCardTransaction(amount: number, address: string): Promise<string>;
    createInvoice(options: EntityData<Invoices>): Promise<void>;
    getArbState(oldArb: Arbitraries): Promise<boolean>;
    createQiwiTransaction(amount: number, address: string): Promise<string>;
}
