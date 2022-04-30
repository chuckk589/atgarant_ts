import { EntityManager } from '@mikro-orm/core';
import { Arbitraries } from 'src/mikroorm/entities/Arbitraries';
export declare class TelegramService {
    private readonly em;
    constructor(em: EntityManager);
    getArbitrary(id: number): Promise<import("@mikro-orm/core").Loaded<Arbitraries, never>>;
    updateSessionString(session: string): Promise<void>;
}
