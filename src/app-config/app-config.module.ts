import { EntityManager, MikroORM } from '@mikro-orm/core';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions, ConfigService } from '@nestjs/config';
import { Configs } from 'src/mikroorm/entities/Configs';
import { Invoicestatuses } from 'src/mikroorm/entities/Invoicestatuses';
import { Offerstatuses } from 'src/mikroorm/entities/Offerstatuses';
import { Paymentmethods } from 'src/mikroorm/entities/Paymentmethods';
import { Profiles } from 'src/mikroorm/entities/Profiles';
import { Users } from 'src/mikroorm/entities/Users';
import { AppConfigService } from './app-config.service';

@Global()
@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {
  constructor(private readonly em: EntityManager) {}
  public static forRootAsync(options: ConfigModuleOptions = {}): DynamicModule {
    const BotOptionsProvider: Provider = {
      provide: 'test',
      useFactory: async (orm: MikroORM) => {
        const configs = await orm.em.find(Configs, {});
        configs.map((config) => (process.env[config.name] = config.value));

        const paymentMethods = await orm.em.find(Paymentmethods, {});
        paymentMethods.map(
          (paymentMethod) =>
            (process.env[
              paymentMethod.value
            ] = `${paymentMethod.feeRaw}:${paymentMethod.feePercent}:${paymentMethod.minSum}:${paymentMethod.maxSum}:${paymentMethod.id}`),
        );

        const offerStatuses = await orm.em.find(Offerstatuses, {});
        offerStatuses.map(
          (offerStatus) => (process.env[`offerStatus_${offerStatus.id}`] = `${offerStatus.value}:${offerStatus.name}`),
        );
        const invoiceStatuses = await orm.em.find(Invoicestatuses, {});
        invoiceStatuses.map(
          (invoiceStatus) =>
            (process.env[`invoiceStatus_${invoiceStatus.id}`] = `${invoiceStatus.value}:${invoiceStatus.name}`),
        );
        return {};
      },
      inject: [MikroORM],
    };
    return {
      module: AppConfigModule,
      imports: [ConfigModule.forRoot(options)],
      providers: [BotOptionsProvider],
      exports: [ConfigModule],
    };
  }
}
