import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Users } from "src/mikroorm/entities/Users";
import { BotContext } from "src/types/interfaces";
import { AppConfigService } from "src/app-config/app-config.service";
import { botOfferDto } from "src/mikroorm/dto/create-offer.dto";
import i18n from '../middleware/i18n'
import { Offers } from "src/mikroorm/entities/Offers";
import { isSeller } from "../common/helpers";
import { Arbitraries } from "src/mikroorm/entities/Arbitraries";



@Injectable()
export class routerService {
  async fetchArb(id: number, chatId: number) {
    const arb = await this.em.findOneOrFail(Arbitraries, {
      id: id,
      offer: {
        $or: [
          { initiator: { chatId: String(chatId) } },
          { partner: { chatId: String(chatId) } }
        ]
      }
    },
      { populate: ['offer.initiator', 'offer.partner', 'offer.paymentMethod', 'offer.invoices'] }
    )
    return arb
  }
  constructor(
    private readonly em: EntityManager,
    private readonly appConfigService: AppConfigService
  ) { }
  async fetchOffer(id: number, chatId: number): Promise<Offers> {
    const offer = await this.em.findOne(Offers, {
      id: id,
      $or: [
        { initiator: { chatId: String(chatId) } },
        { partner: { chatId: String(chatId) } }
      ],
    },
      { populate: ['initiator', 'partner', 'invoices', 'reviews.recipient', 'reviews.author'] }
    )
    return offer
  }
  async fetchContact(ctx: BotContext): Promise<Users> {
    const user = await this.em.findOne(Users, {
      $or: [
        { chatId: ctx.message.text },
        { username: ctx.message.text.replace('@', '') }
      ]
    })
    return user
  }
  async setWallet(ctx: BotContext) {
    const _isSeller = isSeller(ctx)
    await this.em.nativeUpdate(Offers, { id: ctx.session.editedOffer.id }, { [_isSeller ? 'sellerWalletData' : 'buyerWalletData']: ctx.message.text })
  }
}