import { EntityManager } from '@mikro-orm/core';
import { AppConfigService } from 'src/app-config/app-config.service';
export declare class PaymentsService {
    private readonly em;
    private readonly AppConfigService;
    constructor(em: EntityManager, AppConfigService: AppConfigService);
    registerPayment(txn_id: string): Promise<void>;
}
