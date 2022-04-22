import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Offers, OffersRole } from 'src/mikroorm/entities/Offers';
import { Users } from 'src/mikroorm/entities/Users';
import { AppConfigService } from 'src/app-config/app-config.controller';
import { Offerstatuses } from 'src/mikroorm/entities/Offerstatuses';

@Injectable()
export class AppEventsService {
    async rejectOfferById(payload: any, status: string): Promise<Offers> {
        const offerstatus = this.AppConfigService.offerStatus(status)
        const offer = await this.getOfferById(payload)
        offer.offerStatus = this.em.getReference(Offerstatuses, offerstatus.id)
        this.em.persistAndFlush(offer)
        return offer;
    }
    constructor(
        private readonly em: EntityManager,
        private readonly AppConfigService: AppConfigService,
    ) {}
    async getOfferById(id: number): Promise<Offers> {
        const offer = await this.em.findOneOrFail(Offers, { id: id }, { populate: ['partner', 'initiator'] })
        return offer
    }
    async updateOfferStatus(offer: Offers, status: string) {
        const offerstatus = this.AppConfigService.offerStatus(status)
        offer.offerStatus = this.em.getReference(Offerstatuses, offerstatus.id)
        // await this.em.nativeUpdate(Offers, { id: id }, {
        //     offerStatus: offerstatus.id
        // })
        this.em.persistAndFlush(offer)
    }
    usersByRoles(offer: Offers): { seller: Users, buyer: Users } {
        const seller = offer.role === OffersRole.SELLER ? 'initiator' : 'partner'
        const buyer = offer.role === OffersRole.BUYER ? 'initiator' : 'partner'
        return {
            seller: offer[seller],
            buyer: offer[buyer]
        }
    }
    getOppositeChatId(offer: Offers, from: number) {
        return offer.initiator.chatId === String(from) ? offer.partner.chatId : offer.initiator.chatId
    }
}
