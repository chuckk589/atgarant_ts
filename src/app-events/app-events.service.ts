import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Offers, OffersRole } from 'src/mikroorm/entities/Offers';
import { Users } from 'src/mikroorm/entities/Users';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Offerstatuses } from 'src/mikroorm/entities/Offerstatuses';
import { Invoices } from 'src/mikroorm/entities/Invoices';
import { Invoicestatuses } from 'src/mikroorm/entities/Invoicestatuses';

@Injectable()
export class AppEventsService {
    async closeArbitraryOfferAttempt(offerId: number) {
        const waitStatus = this.AppConfigService.invoiceStatus<string>('waiting')
        const count = await this.em.findAndCount(Invoices, { offer: offerId, invoiceStatus: waitStatus.id })
        if (!count[1]) {
            await this.updateOfferStatus<number>(offerId, 'closed')
        }
    }
    async getOfferByTxnId(txn_id: string): Promise<Offers> {
        const offer = await this.em.findOne(Offers, { invoices: { txnId: txn_id } }, { populate: ['partner', 'initiator', 'invoices'] })
        //const invoice = await this.em.findOneOrFail(Invoices, { txnId: txn_id }, { populate: ['offer.partner', 'offer.partner', 'offer.offerStatus'] })
        return offer
    }
    constructor(
        private readonly em: EntityManager,
        private readonly AppConfigService: AppConfigService,
    ) { 
    }
    async getOfferById(id: number): Promise<Offers> {
        const offer = await this.em.findOneOrFail(Offers, { id: id }, { populate: ['partner', 'initiator'] })
        return offer
    }
    async updateOfferStatus<T = Offers | number>(payload: T, status: string): Promise<Offers> {
        const offerstatus = this.AppConfigService.offerStatus(status)
        let offer: Offers
        if (payload instanceof Offers) {
            offer = payload
        } else if (typeof payload === 'number') {
            offer = this.em.getReference(Offers, payload)
        }
        offer.offerStatus = this.em.getReference(Offerstatuses, offerstatus.id)
        await this.em.persistAndFlush(offer)
        return offer
    }
    
}
