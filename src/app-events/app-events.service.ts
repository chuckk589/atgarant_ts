import { Entity, EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Offers, OffersRole } from 'src/mikroorm/entities/Offers';
import { Users } from 'src/mikroorm/entities/Users';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Offerstatuses } from 'src/mikroorm/entities/Offerstatuses';
import { Invoices } from 'src/mikroorm/entities/Invoices';
import { Invoicestatuses } from 'src/mikroorm/entities/Invoicestatuses';
import { NewArbitraryOptions, ArbModeratorReview } from 'src/types/interfaces';
import { Arbitraries, ArbitrariesStatus } from 'src/mikroorm/entities/Arbitraries';
import { Reviews, ReviewsRate } from 'src/mikroorm/entities/Reviews';

@Injectable()
export class AppEventsService {
  async updateInvoiceStatus(txn_id: string, status: string) {
    const invoiceStatus = this.AppConfigService.invoiceStatus<string>(status);
    await this.em.nativeUpdate(
      Invoices,
      { txnId: txn_id },
      {
        invoiceStatus: this.em.getReference(Offerstatuses, invoiceStatus.id),
      },
    );
  }
  async createNewReview(recipientId: number, authorId: number, feedback: string, rate: ReviewsRate, offerId: number) {
    const review = this.em.create(Reviews, {
      author: authorId,
      recipient: recipientId,
      offer: offerId,
      rate: rate,
      text: feedback,
    });
    await this.em.persistAndFlush(review);
  }
  async applyArbUpdate(arbData: Arbitraries) {
    await this.em.persistAndFlush(arbData);
  }
  async createNewArbitrary(options: NewArbitraryOptions) {
    const arb = this.em.create(Arbitraries, {
      reason: options.reason,
      chatId: options.chatData.chat_id,
      status: ArbitrariesStatus.ACTIVE,
      offer: options.offerId,
      initiator: options.issuerId,
      arbiter: this.em.getReference(Users, options.moderatorId),
    });
    await this.em.persistAndFlush(arb);
  }
  async closeArbitraryOfferAttempt(offerId: number) {
    const waitStatus = this.AppConfigService.invoiceStatus<string>('waiting');
    const count = await this.em.findAndCount(Invoices, { offer: offerId, invoiceStatus: waitStatus.id });
    if (!count[1]) {
      await this.updateOfferStatus<number>(offerId, 'closed');
    }
  }
  async getOfferByTxnId(txn_id: string): Promise<Offers> {
    return await this.em.findOne(
      Offers,
      { invoices: { txnId: txn_id } },
      { populate: ['partner', 'initiator', 'invoices', 'offerStatus'] },
    );
  }
  constructor(private readonly em: EntityManager, private readonly AppConfigService: AppConfigService) {}
  async getOfferById(id: number): Promise<Offers> {
    const offer = await this.em.findOneOrFail(
      Offers,
      { id: id },
      { populate: ['partner', 'initiator', 'paymentMethod'] },
    );
    return offer;
  }
  async getArbById(id: number): Promise<Arbitraries> {
    const arb = await this.em.findOneOrFail(
      Arbitraries,
      { id: id },
      { populate: ['offer', 'offer.paymentMethod', 'offer.invoices'] },
    );
    return arb;
  }
  async updateOfferStatus<T = Offers | number>(payload: T, status: string): Promise<Offers> {
    const offerstatus = this.AppConfigService.offerStatus<string>(status);
    let offer: Offers;
    if (payload instanceof Offers) {
      offer = payload;
    } else if (typeof payload === 'number') {
      offer = this.em.getReference(Offers, payload);
    }
    offer.offerStatus = this.em.getReference(Offerstatuses, offerstatus.id);
    await this.em.persistAndFlush(offer);
    return offer;
  }
  async getLeastBusyMod(): Promise<Users> {
    const moderators = await this.em.find(
      Users,
      { role: 2 },
      {
        populate: ['arbs'],
        populateWhere: {
          arbs: {
            status: {
              $in: ['active', 'disputed'],
            },
          },
        },
      },
    );
    const sorted = moderators.sort((a, b) => {
      return a.arbs.length - b.arbs.length;
    });
    return sorted.length ? sorted[0] : undefined;
  }
}
