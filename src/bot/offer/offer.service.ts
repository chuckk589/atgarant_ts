import { EntityManager, wrap } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { botOfferDto } from "src/mikroorm/dto/create-offer.dto";
import { Offers, OffersFeePayer, OffersRole } from "src/mikroorm/entities/Offers";
import { Offerstatuses } from "src/mikroorm/entities/Offerstatuses";
import { Paymentmethods } from "src/mikroorm/entities/Paymentmethods";
import { BotContext } from "src/types/interfaces";
import { Users } from '../../mikroorm/entities/Users'
import { mainKeyboard, offerKeyboard } from "../common/keyboards";

@Injectable()
export class offerService {
  constructor(
    private readonly em: EntityManager,
    //private readonly routerService: routerService,
  ) { }

  async acceptRules(ctx: BotContext) {
    let user = await this.em.findOne(Users, { chatId: String(ctx.from.id) })
    if (!user) {
      user.acceptedRules = 1
    }
    await this.em.persistAndFlush(user)
  }
  
}