import { DynamicModule, Module, Provider } from '@nestjs/common';
import { PaymentProviderController } from './payment-provider.controller';
import { PAYMENT_SERVICE, PAYMENT_SERVICE_OPTIONS } from 'src/constants';
import { PaymentsModule } from 'src/payments/payments.module';
import { PaymentsOptionsAsync, PaymentsOptions } from 'src/types/interfaces';
import { BtcCoreService } from './BTC.service';
import { CoinPaymentsService } from './CP.service';

@Module({})
export class PaymentProviderModule {
  public static forRootAsync(options: PaymentsOptionsAsync): DynamicModule {
    const PaymentsServiceProvider: Provider = {
      provide: PAYMENT_SERVICE,
      useFactory: (options: PaymentsOptions) => this.resolveClass(options),
      inject: [PAYMENT_SERVICE_OPTIONS],
    }
    const PaymentsOptionsProvider: Provider = {
      provide: PAYMENT_SERVICE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    }
    return {
      module: PaymentProviderModule,
      providers: [
        PaymentProviderController,
        PaymentsServiceProvider,
        PaymentsOptionsProvider,
        {
          provide: 'wtf',
          useExisting: PAYMENT_SERVICE,
        }
      ],
      exports: [
        PaymentProviderController,
      ]
    }
  }
  static resolveClass(options: PaymentsOptions) {
    return options.mode == 'btc-core' ? BtcCoreService : CoinPaymentsService
  }
}