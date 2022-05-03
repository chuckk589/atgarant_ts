import { EntityManager } from '@mikro-orm/core';
import { Offers } from 'src/mikroorm/entities/Offers';
import { AppEventsController } from 'src/app-events/app-events.controller';
import { Offerstatuses } from 'src/mikroorm/entities/Offerstatuses';
import { CreateArbDto } from './dto/create-arb.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
export declare class OfferService {
    private readonly em;
    private readonly AppEventsController;
    update(id: number, updateOfferDto: UpdateOfferDto): Promise<number>;
    createArb(id: string, body: CreateArbDto): Promise<Offerstatuses>;
    offerAction(id: string): Promise<Offerstatuses>;
    constructor(em: EntityManager, AppEventsController: AppEventsController);
    findAll(userId?: string): Promise<import("@mikro-orm/core").Loaded<Offers, "initiator" | "partner" | "paymentMethod" | "offerStatus" | "reviews">[]>;
}
