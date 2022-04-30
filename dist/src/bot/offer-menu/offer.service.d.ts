import { EntityManager } from "@mikro-orm/core";
import { BotContext } from "src/types/interfaces";
export declare class offerService {
    private readonly em;
    constructor(em: EntityManager);
    acceptRules(ctx: BotContext): Promise<void>;
}
