import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Offers } from 'src/mikroorm/entities/Offers';

@Injectable()
export class AppEventsService {
    constructor(
        private readonly em: EntityManager,
    ) { }
    async getOfferById(id: number): Promise<Offers> {
        const offer = await this.em.findOneOrFail(Offers, { id: id }, { populate: ['partner'] })
        return offer
    }
}
