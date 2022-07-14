import { Inject, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LoggerModule } from 'nestjs-pino';
import { HttpModule } from '@nestjs/axios';
import { BotModule } from 'src/bot/bot.module';
import { botOptionsProvider } from './common/providers';
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
import { ViolationModule } from './violation/violation.module';
import { ReviewModule } from './review/review.module';
import { OfferModule } from './offer/offer.module';
import { LinkModule } from './link/link.module';
import { ConfigModule } from './config/config.module';
import { ArbitraryModule } from './arbitrary/arbitrary.module';
import { WebappModule } from './webapp/webapp.module';
import ORMOptionsProvider from 'src/configs/mikro-orm.config';

@Module({
  imports: [
    AppConfigModule.forRootAsync(),
    LoggerModule.forRoot(),
    BotModule.forRootAsync(botOptionsProvider),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '.', 'public') }),
    UserModule,
    PaymentsModule,
    TelegramModule,
    AuthModule,
    ViolationModule,
    ReviewModule,
    OfferModule,
    LinkModule,
    ConfigModule,
    ArbitraryModule,
    WebappModule,
    MikroOrmModule.forRoot(ORMOptionsProvider),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
