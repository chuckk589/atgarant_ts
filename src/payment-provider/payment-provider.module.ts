import { MikroORM } from '@mikro-orm/core';
import { DynamicModule, forwardRef, Module, Provider } from '@nestjs/common';
import { PAYMENTS_CONTROLLER } from 'src/constants';
import { Configs } from 'src/mikroorm/entities/Configs';
import { PaymentsOptionsAsync, PaymentsOptions } from 'src/types/interfaces';
import { BtcCoreController } from './btc-core/btc-core.controller';
import { BtcCoreService } from './btc-core/btc-core.service';
import { CoinPayController } from './coin-pay/coin-pay.controller';
import { CoinPayService } from './coin-pay/coin-pay.service';
import { HttpModule } from '@nestjs/axios';
import { AppEventsModule } from 'src/app-events/app-events.module';

@Module({
  imports: [forwardRef(() => AppEventsModule)],
  providers: [CoinPayController, CoinPayService, BtcCoreController, BtcCoreService],
  exports: [CoinPayController, BtcCoreController],
})
export class PaymentProviderModule {
  public static forRootAsync(options?: PaymentsOptionsAsync): DynamicModule {
    const PaymentsOptionsProvider: Provider = {
      provide: PAYMENTS_CONTROLLER,
      useFactory: async (orm: MikroORM, a: CoinPayController, b: BtcCoreController) => {
        const config = await orm.em.findOne(Configs, { name: 'PAYMENT_SERVICE' });
        return config?.value == 'btc-core' ? b : a;
      },
      inject: [MikroORM, CoinPayController, BtcCoreController],
    };
    return {
      module: PaymentProviderModule,
      providers: [PaymentsOptionsProvider],
      exports: [PaymentsOptionsProvider],
    };
  }
}
