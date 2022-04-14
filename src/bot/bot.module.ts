import { Module, DynamicModule, Inject } from "@nestjs/common";
import { Bot, Context } from "grammy";
import { BotContext, GrammyBotOptionsAsync } from "src/types/interfaces";
import { BotCoreModule } from "./botcore/botcore.module";

@Module({})
export class BotModule {
  constructor() { }
  public static forRootAsync<T extends Context>(options: GrammyBotOptionsAsync): DynamicModule {
    return {
      module: BotModule,
      imports: [BotCoreModule.forRootAsync<T>(options)],
      exports: [BotCoreModule],
    };
  }
}
