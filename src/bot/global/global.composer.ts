import { Injectable, SetMetadata } from "@nestjs/common";
import { BotContext } from "src/types/interfaces";
import { Command, ComposerController, Hears, On} from "../common/decorators";
import { globalService } from './global.service'


@Injectable()
export class globalComposer {
  constructor(
    private readonly globalService: globalService
  ) {}
  @Command('start')
  start: Function = (ctx: BotContext) => this.globalService.start(ctx)

  @Hears('offers')
  offers: Function = (ctx: BotContext) => this.globalService.offers(ctx)

  @Hears('arbitraries')
  arbitraries: Function = (ctx: BotContext) => this.globalService.start(ctx)

  @Hears('account')
  account: Function = (ctx: BotContext) => this.globalService.start(ctx)

  @Hears('rules')
  rules: Function = (ctx: BotContext) => this.globalService.start(ctx)

  @Hears('instructions')
  instructions: Function = (ctx: BotContext) => this.globalService.start(ctx)

  @Hears('info')
  info: Function = (ctx: BotContext) => this.globalService.start(ctx)
}