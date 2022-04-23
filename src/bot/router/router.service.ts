import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Users } from "src/mikroorm/entities/Users";
import { BotContext } from "src/types/interfaces";
import { AppConfigService } from "src/app-config/app-config.service";
import { botOfferDto } from "src/mikroorm/dto/create-offer.dto";
import i18n from '../middleware/i18n'
import { Offers } from "src/mikroorm/entities/Offers";



@Injectable()
export class routerService {
  constructor(
    private readonly em: EntityManager,
    private readonly appConfigService: AppConfigService
  ) { }
  async fetchOffer(id: number): Promise<Offers> {
    const offer = await this.em.findOne(Offers, { id: id },
      { populate: ['initiator', 'partner', 'invoices', 'paymentMethod', 'invoices'] }
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

}