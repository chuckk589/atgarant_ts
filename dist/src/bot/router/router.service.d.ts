import { EntityManager } from '@mikro-orm/core';
import { Users } from 'src/mikroorm/entities/Users';
import { BotContext } from 'src/types/interfaces';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Offers } from 'src/mikroorm/entities/Offers';
import { Arbitraries } from 'src/mikroorm/entities/Arbitraries';
export declare class routerService {
    private readonly em;
    private readonly appConfigService;
    fetchArb(id: number, chatId: number): Promise<import("@mikro-orm/core").Loaded<Arbitraries, "offer.initiator" | "offer.partner" | "offer.paymentMethod" | "offer.invoices">>;
    constructor(em: EntityManager, appConfigService: AppConfigService);
    fetchOffer(id: number, chatId: number): Promise<Offers>;
    fetchContact(ctx: BotContext): Promise<Users>;
    setWallet(ctx: BotContext): Promise<void>;
}
