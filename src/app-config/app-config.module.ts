import { EntityManager } from '@mikro-orm/core';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
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
  exports: [AppConfigService]
})
export class AppConfigModule {
  constructor(
    private readonly em: EntityManager,
  ) {
  }
  public static forRootAsync(options: ConfigModuleOptions = {}): DynamicModule {
    return {
      module: AppConfigModule,
      imports: [ConfigModule.forRoot(options)],
      exports: [ConfigModule],
    };
  }
  async onModuleInit() {
    const configs = await this.em.find(Configs, {})
    configs.map(config => process.env[config.name!] = config.value);

    //const options = process.env.PAYMENT_SERVICE == 'btc-core' ? { value: 'paymentMethod_BTC' } : {}
    const paymentMethods = await this.em.find(Paymentmethods, {})
    paymentMethods.map(paymentMethod => process.env[paymentMethod.value] = `${paymentMethod.feeRaw} ${paymentMethod.feePercent} ${paymentMethod.minSum} ${paymentMethod.maxSum} ${paymentMethod.id}`);

    const offerStatuses = await this.em.find(Offerstatuses, {})
    offerStatuses.map(offerStatus => process.env[`offerStatus_${offerStatus.id}`] = `${offerStatus.value} ${offerStatus.name}`);
    const invoiceStatuses = await this.em.find(Invoicestatuses, {})
    invoiceStatuses.map(invoiceStatus => process.env[`invoiceStatus_${invoiceStatus.id}`] = `${invoiceStatus.value} ${invoiceStatus.name}`);
  }
}
