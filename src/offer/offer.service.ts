import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Offers } from 'src/mikroorm/entities/Offers';
import { AppEventsController } from 'src/app-events/app-events.controller';
import { Offerstatuses } from 'src/mikroorm/entities/Offerstatuses';
import { CreateArbDto } from './dto/create-arb.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OfferService {
  async update(id: number, updateOfferDto: UpdateOfferDto) {
    return await this.em.nativeUpdate(
      Offers,
      {
        id: id,
      },
      {
        [updateOfferDto.seller ? 'sellerWalletData' : 'buyerWalletData']: updateOfferDto.walletData,
      },
    );
  }
  async createArb(id: string, body: CreateArbDto) {
    return await this.AppEventsController.arbOpened<number>(Number(id), body.reason, body.initiator);
  }
  async offerAction(id: string): Promise<Offerstatuses> {
    const offer = await this.em.findOneOrFail(
      Offers,
      { id: Number(id) },
      { populate: ['partner', 'initiator', 'offerStatus'] },
    );
    if (offer.offerStatus.value == 'payed') {
      return await this.AppEventsController.offerShipped<Offers>(offer);
    } else if (offer.offerStatus.value == 'shipped') {
      return await this.AppEventsController.offerArrived<Offers>(offer);
    } else if (offer.offerStatus.value == 'arrived') {
      return await this.AppEventsController.offerPaymentRequested<Offers>(offer);
    } else if (offer.offerStatus.value == 'pending') {
      //TODO: implement
    }
  }
  constructor(private readonly em: EntityManager, private readonly AppEventsController: AppEventsController) {}

  async findAll(userId?: string) {
    const options = userId
      ? {
          $or: [{ partner: { id: Number(userId) } }, { initiator: { id: Number(userId) } }],
        }
      : {};
    return await this.em.find(Offers, options, {
      populate: ['initiator', 'partner', 'offerStatus', 'paymentMethod', 'reviews'],
    });
  }
}
