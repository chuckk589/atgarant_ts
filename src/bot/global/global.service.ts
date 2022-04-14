import { EntityManager } from "@mikro-orm/core";
import { Injectable } from "@nestjs/common";
import { BotContext } from "src/types/interfaces";
import { Users } from '../../mikroorm/entities/Users'
import { mainKeyboard, offerKeyboard } from "../common/keyboards";

@Injectable()
export class globalService {
  constructor(
    private readonly em: EntityManager,
  ) { }

  async start(ctx: BotContext) {
    let user = await this.em.findOne(Users, { chatId: String(ctx.from.id) })
    if (!user) {
      user = await this.em.create(Users, {
        chatId: String(ctx.from.id),
        username: ctx.from.username,
        firstName: String(ctx.from.first_name)
      })
    }
    ctx.i18n.locale(user.locale)
    ctx.reply(ctx.i18n.t('start'), { reply_markup: mainKeyboard(ctx) })
  }

  async offers(ctx: BotContext) {
    console.log(228)
    ctx.replyWithPhoto('../media/04.jpg', { caption: ctx.i18n.t('offerMenu'), reply_markup: offerKeyboard(ctx) })
  }
}
