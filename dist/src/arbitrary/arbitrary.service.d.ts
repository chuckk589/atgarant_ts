import { EntityManager } from '@mikro-orm/core';
import { Arbitraries } from 'src/mikroorm/entities/Arbitraries';
import { TelegramGateway } from 'src/telegram/telegram.gateway';
import { AppEventsController } from 'src/app-events/app-events.controller';
import { CloseArbDto } from './dto/close-arbitrary.dto';
import { DisputeArbDto } from './dto/dispute-arbitrary.dto';
export declare class ArbitraryService {
    private readonly em;
    private readonly telegramGateway;
    private readonly AppEventsController;
    constructor(em: EntityManager, telegramGateway: TelegramGateway, AppEventsController: AppEventsController);
    disputeArb(id: string, DisputeArbDto: DisputeArbDto): Promise<import("src/mikroorm/entities/Arbitraries").ArbitrariesStatus>;
    closeArb(id: string, arbData: CloseArbDto): Promise<import("src/mikroorm/entities/Arbitraries").ArbitrariesStatus>;
    getHistory(id: string): Promise<string>;
    findAll(userId?: string): Promise<import("@mikro-orm/core").Loaded<Arbitraries, "offer.initiator" | "offer.partner" | "arbiter">[]>;
}
