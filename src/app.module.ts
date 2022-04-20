import { Inject, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { LoggerModule } from 'nestjs-pino';
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

@Module({
  imports: [
    MikroOrmModule.forRootAsync(ORMOptionsProvider),
    LoggerModule.forRoot(),
    BotModule.forRootAsync<BotContext>(botOptionsProvider),
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '../public') }),
    AppConfigModule.forRootAsync(),
    AppEventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(
    private readonly em: EntityManager,
  ) { 
  }
  async onModuleInit() {
    const configs = await this.em.find(Configs, {})
    configs.map(config => process.env[config.name!] = config.value);
    const options = process.env.PAYMENT_SERVICE == 'btc-core' ? { value: 'paymentMethod_BTC' } : {}
    const paymentMethods = await this.em.find(Paymentmethods, options)
    paymentMethods.map(paymentMethod => process.env[paymentMethod.value!] = `${paymentMethod.feeRaw} ${paymentMethod.feePercent} ${paymentMethod.minSum} ${paymentMethod.maxSum} ${paymentMethod.id}`);
  }
}
