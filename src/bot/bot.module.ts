import { Module, DynamicModule, Inject, Provider, Global } from '@nestjs/common';
import { Bot, Context } from 'grammy';
import { createBotFactory } from 'src/common/factories';
import { BOT_NAME, BOT_OPTIONS } from 'src/constants';
import { BotContext, GrammyBotOptions, GrammyBotOptionsAsync } from 'src/types/interfaces';

@Global()
@Module({})
export class BotModule {
  public static forRootAsync(options: GrammyBotOptionsAsync): DynamicModule {
    const BotProvider: Provider = {
      provide: BOT_NAME,
      useFactory: async (options: GrammyBotOptions) => await createBotFactory(options),
      inject: [BOT_OPTIONS],
    };
    const BotOptionsProvider: Provider = {
      provide: BOT_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
    return {
      module: BotModule,
      imports: options.imports,
      providers: [BotProvider, BotOptionsProvider],
      exports: [BotProvider, BotOptionsProvider],
    };
  }
}
