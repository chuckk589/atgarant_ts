import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Offers } from "src/mikroorm/entities/Offers";
import { Offerstatuses } from "src/mikroorm/entities/Offerstatuses";
import { Paymentmethods } from "src/mikroorm/entities/Paymentmethods";
import { BotContext } from "src/types/interfaces";
import { Users } from '../../mikroorm/entities/Users'
import { mainKeyboard, offerKeyboard } from "../common/keyboards";

@Injectable()
export class globalService {
  constructor(
    private readonly em: EntityManager,
  ) { }

  async fetchUser(ctx: BotContext): Promise<Users> {
    let user = await this.em.findOne(Users, { chatId: String(ctx.from.id) })
    if (!user) {
      user = await this.em.create(Users, {
        chatId: String(ctx.from.id),
        username: ctx.from.username,
        firstName: String(ctx.from.first_name)
      })
    }
    return user
  }
  async createOffer(ctx: BotContext): Promise<Offers> {
    const offerDTO = ctx.session.pendingOffer
    const newoffer = await this.em.create(Offers, {
      estimatedShipping: '11.11.2021',
      feeBaked: offerDTO.feeBaked,
      feePayer: offerDTO.feePayer,
      role: offerDTO.role,
      offerValue: offerDTO.offerValue,
      productDetails: offerDTO.productDetails,
      shippingDetails: offerDTO.shippingDetails,
      productAdditionalDetails: offerDTO.productAdditionalDetails,
      restDetails: offerDTO.restDetails,
      refundDetails: offerDTO.refundDetails,
      initiator: await this.em.findOneOrFail(Users, { chatId: offerDTO.initiator_chatId }),
      partner: await this.em.findOneOrFail(Users, { chatId: offerDTO.partner_chatId }),
      offerStatus: await this.em.findOneOrFail(Offerstatuses, { value: 'pending' }),
      paymentMethod: await this.em.findOneOrFail(Paymentmethods, { id: offerDTO.paymentMethodId })
    })
    await this.em.persistAndFlush(newoffer)
    return newoffer
  }
}
