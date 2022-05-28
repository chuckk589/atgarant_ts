import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Offers } from 'src/mikroorm/entities/Offers';
import { Offerstatuses } from 'src/mikroorm/entities/Offerstatuses';
import { Paymentmethods } from 'src/mikroorm/entities/Paymentmethods';
import { Profiles } from 'src/mikroorm/entities/Profiles';
import { BotContext } from 'src/types/interfaces';
import { Users } from '../../mikroorm/entities/Users';
import { mainKeyboard, offerKeyboard } from '../common/keyboards';
import { AppConfigService } from 'src/app-config/app-config.service';
import { InvoicesType } from 'src/mikroorm/entities/Invoices';
import { Arbitraries } from 'src/mikroorm/entities/Arbitraries';

@Injectable()
export class globalService {
  async createUserPassword(user: Users): Promise<string> {
    const password = Math.random().toString(36).substr(2, 11);
    user.password = password;
    await this.em.persistAndFlush(user);
    return password;
  }
  async updateLocale(chatId: number, locale: string) {
    await this.em.nativeUpdate(Users, { chatId: String(chatId) }, { locale: locale });
  }
  async fetchAllArbs(chatid: number): Promise<Arbitraries[]> {
    const arbs = await this.em.find(
      Arbitraries,
      {
        offer: {
          $or: [{ initiator: { chatId: String(chatid) } }, { partner: { chatId: String(chatid) } }],
        },
      },
      { populate: ['offer.initiator', 'offer.partner', 'offer.paymentMethod', 'offer.invoices'] },
    );
    return arbs;
  }
  async fetchActiveArbs(chatid: number): Promise<Arbitraries[]> {
    const arbs = await this.em.find(
      Arbitraries,
      {
        offer: {
          $or: [{ initiator: { chatId: String(chatid) } }, { partner: { chatId: String(chatid) } }],
        },
      },
      { populate: ['offer.initiator', 'offer.partner', 'offer.paymentMethod', 'offer.invoices'] },
    );
    return arbs;
  }
  async fetchActiveOffers(chatid: number): Promise<Offers[]> {
    const offers = await this.em.find(
      Offers,
      {
        $or: [{ initiator: { chatId: String(chatid) } }, { partner: { chatId: String(chatid) } }],
        offerStatus: { value: { $nin: ['closed', 'pending'] } },
      },
      { populate: ['initiator', 'partner', 'invoices', 'paymentMethod', 'invoices', 'offerStatus'] },
    );
    return offers;
  }
  async fetchOffers(chatid: number): Promise<Offers[]> {
    const offers = await this.em.find(
      Offers,
      {
        $or: [{ initiator: { chatId: String(chatid) } }, { partner: { chatId: String(chatid) } }],
      },
      { populate: ['initiator', 'partner', 'invoices', 'paymentMethod', 'invoices', 'offerStatus'] },
    );
    return offers;
  }
  constructor(private readonly em: EntityManager, private readonly AppConfigService: AppConfigService) {}

  async fetchUser(ctx: BotContext): Promise<Users> {
    let user = await this.em.findOne(Users, { chatId: String(ctx.from.id) });
    if (!user) {
      user = this.em.create(Users, {
        chatId: String(ctx.from.id),
        username: ctx.from.username,
        firstName: String(ctx.from.first_name),
      });
      await this.em.persistAndFlush(user);
    }
    return user;
  }
  async fetchQueryUsers(payload: string | number): Promise<Users[]> {
    const users = await this.em.find(
      Users,
      {
        $or: [{ chatId: { $like: `%${String(payload)}%` } }, { username: { $like: `%${String(payload)}%` } }],
      },
      {
        limit: 10,
        populate: ['profile'],
      },
    );
    return users;
  }

  async createOffer(ctx: BotContext): Promise<Offers> {
    const offerDTO = ctx.session.pendingOffer;
    const offerStatus = this.AppConfigService.offerStatus<string>('pending');
    const newoffer = new Offers();
    newoffer.estimatedShipping = offerDTO.estimatedShipping;
    newoffer.feeBaked = offerDTO.feeBaked;
    newoffer.feePayer = offerDTO.feePayer;
    newoffer.role = offerDTO.role;
    newoffer.offerValue = offerDTO.offerValue;
    newoffer.productDetails = offerDTO.productDetails;
    newoffer.shippingDetails = offerDTO.shippingDetails;
    newoffer.productAdditionalDetails = offerDTO.productAdditionalDetails;
    newoffer.restDetails = offerDTO.restDetails;
    newoffer.refundDetails = offerDTO.refundDetails;
    newoffer.initiator = await this.em.findOneOrFail(Users, { chatId: offerDTO.initiator_chatId });
    newoffer.partner = await this.em.findOneOrFail(Users, { chatId: offerDTO.partner_chatId });
    newoffer.offerStatus = this.em.getReference(Offerstatuses, offerStatus.id);
    newoffer.paymentMethod = this.em.getReference(Paymentmethods, offerDTO.paymentMethodId);
    await this.em.persistAndFlush(newoffer);

    return newoffer;
  }
}
