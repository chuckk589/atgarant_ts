import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { BotModule } from 'src/bot/bot.module';
import { botOptionsProvider, ORMOptionsProvider } from './common/providers';
import { BotContext } from './types/interfaces';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MikroOrmModule.forRootAsync(ORMOptionsProvider),
    LoggerModule.forRoot(),
    BotModule.forRootAsync<BotContext>(botOptionsProvider),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
