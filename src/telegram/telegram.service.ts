import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Arbitraries } from 'src/mikroorm/entities/Arbitraries';

@Injectable()
export class TelegramService {
    constructor(
        private readonly em: EntityManager,
    ) { }
    async getArbitrary(id: number) {
        const arb = await this.em.findOneOrFail(Arbitraries, { id: id });
        return arb
    }
}
