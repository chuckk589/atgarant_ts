import { DynamicModule, Inject, Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';

@Module({
    controllers: [BotController],
    providers: [BotService],
    imports: []
})
export class BotModule {
    public static forRoot(options: GrammyBotOptions): DynamicModule {
      return {
        module: BotModule,
        imports: [BotCoreModule.forRoot(options)],
        exports: [BotCoreModule],
      };
    }
  }
