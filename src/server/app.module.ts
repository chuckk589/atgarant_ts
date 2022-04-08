import { Module } from '@nestjs/common';
import { BotModule } from './bot/bot.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from 'src/configs/mikro-orm.config'

@Module({
  imports: [
    BotModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(config),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
