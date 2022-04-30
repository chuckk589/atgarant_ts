import { EntityManager } from '@mikro-orm/core';
import { Offers } from 'src/mikroorm/entities/Offers';
import { Users } from 'src/mikroorm/entities/Users';
import { AppConfigService } from 'src/app-config/app-config.service';
import { NewArbitraryOptions } from 'src/types/interfaces';
import { Arbitraries } from 'src/mikroorm/entities/Arbitraries';
import { ReviewsRate } from 'src/mikroorm/entities/Reviews';
export declare class AppEventsService {
    private readonly em;
    private readonly AppConfigService;
    updateInvoiceStatus(txn_id: string, status: string): Promise<void>;
    createNewReview(recipientId: number, authorId: number, feedback: string, rate: ReviewsRate, offerId: number): Promise<void>;
    applyArbUpdate(arbData: Arbitraries): Promise<void>;
    createNewArbitrary(options: NewArbitraryOptions): Promise<void>;
    closeArbitraryOfferAttempt(offerId: number): Promise<void>;
    getOfferByTxnId(txn_id: string): Promise<Offers>;
    constructor(em: EntityManager, AppConfigService: AppConfigService);
    getOfferById(id: number): Promise<Offers>;
    getArbById(id: number): Promise<Arbitraries>;
    updateOfferStatus<T = Offers | number>(payload: T, status: string): Promise<Offers>;
    getLeastBusyMod(): Promise<Users>;
}
