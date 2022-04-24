import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { Users } from "src/mikroorm/entities/Users";
import { BotContext } from "src/types/interfaces";
import { AppConfigService } from "src/app-config/app-config.service";
import { botOfferDto } from "src/mikroorm/dto/create-offer.dto";
import i18n from '../middleware/i18n'
import { Offers } from "src/mikroorm/entities/Offers";
import { isSeller } from "../common/helpers";



@Injectable()
export class routerService {
  constructor(
    private readonly em: EntityManager,
    private readonly appConfigService: AppConfigService
  ) { }
  async fetchOffer(id: number): Promise<Offers> {
    const offer = await this.em.findOne(Offers, { id: id },
      { populate: ['initiator', 'partner', 'invoices', 'paymentMethod', 'invoices', 'offerStatus'] }
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
    await this.em.nativeUpdate(Offers, { id: ctx.session.pendingOffer.id },
      {
        [_isSeller ? 'sellerWalletData' : 'buyerWalletData']: ctx.message.text
      })
  }
  //   offer.update({
  //     [isSeller(ctx.wizard.state.currentOffer, ctx.from.id) ? 'sellerWalletData' : 'buyerWalletData']: ctx.message.text
  // }, {
  //     where: { id: ctx.wizard.state.currentOffer.id }
  // })
  //     .then(r => {
  //         ctx.reply(ctx.i18n.t('dataUpdated'), markups.mainGroup(ctx))
  //         return ctx.wizard.back()
  //     })
  //     .catch(r => {
  //         ctx.reply(ctx.i18n.t('wrongData'))
  //     })
  // }
}