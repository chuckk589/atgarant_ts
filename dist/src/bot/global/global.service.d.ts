import { EntityManager } from "@mikro-orm/core";
import { Offers } from "src/mikroorm/entities/Offers";
import { BotContext } from "src/types/interfaces";
import { Users } from '../../mikroorm/entities/Users';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Arbitraries } from "src/mikroorm/entities/Arbitraries";
export declare class globalService {
    private readonly em;
    private readonly AppConfigService;
    updateLocale(chatId: number, locale: string): Promise<void>;
    fetchAllArbs(chatid: number): Promise<Arbitraries[]>;
    fetchActiveArbs(chatid: number): Promise<Arbitraries[]>;
    fetchActiveOffers(chatid: number): Promise<Offers[]>;
    fetchOffers(chatid: number): Promise<Offers[]>;
    constructor(em: EntityManager, AppConfigService: AppConfigService);
    fetchUser(ctx: BotContext): Promise<Users>;
    fetchQueryUsers(payload: string | number): Promise<Users[]>;
    createOffer(ctx: BotContext): Promise<Offers>;
}
