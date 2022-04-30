import { Inject, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LoggerModule } from 'nestjs-pino';
import { HttpModule } from '@nestjs/axios'
import { BotModule } from 'src/bot/bot.module';
import { botOptionsProvider, ORMOptionsProvider } from './common/providers';
import { BotContext } from './types/interfaces';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EntityManager } from '@mikro-orm/core';
import { Configs } from './mikroorm/entities/Configs';
import { Paymentmethods } from './mikroorm/entities/Paymentmethods';
import { AppConfigModule } from './app-config/app-config.module';
import { AppEventsModule } from './app-events/app-events.module';
import { BOT_NAME } from './constants';
import { UserModule } from './user/user.module';
import { PaymentsModule } from './payments/payments.module';
import { PaymentProviderModule } from './payment-provider/payment-provider.module';
import { TelegramModule } from './telegram/telegram.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ViolationModule } from './violation/violation.module';
import { ReviewModule } from './review/review.module';
import { OfferModule } from './offer/offer.module';
import { LinkModule } from './link/link.module';
import { ConfigModule } from './config/config.module';
import { ArbitraryModule } from './arbitrary/arbitrary.module';

@Module({
  imports: [
    MikroOrmModule.forRootAsync(ORMOptionsProvider),
    LoggerModule.forRoot(),
    BotModule.forRootAsync(botOptionsProvider),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public')}),
    AppConfigModule.forRootAsync(),
    UserModule,
    PaymentsModule,
    TelegramModule,
    ScheduleModule.forRoot(),
    AuthModule,
    ViolationModule,
    ReviewModule,
    OfferModule,
    LinkModule,
    ConfigModule,
    ArbitraryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
