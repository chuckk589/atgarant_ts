import { DynamicModule, Module, Provider } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { GrammyBotOptions, PaymentsOptions, PaymentsOptionsAsync } from 'src/types/interfaces';
import { createBotFactory } from 'src/common/factories';
import { BOT_NAME, BOT_OPTIONS, PAYMENT_SERVICE, PAYMENT_SERVICE_OPTIONS } from 'src/constants';
import { PaymentProviderModule } from 'src/payment-provider/payment-provider.module';


@Module({
  controllers: [PaymentsController],
})
export class PaymentsModule {
  public static forRootAsync(options: PaymentsOptionsAsync): DynamicModule {
    console.log(PaymentProviderModule.forRootAsync(options))
    return {
      module: PaymentsModule,
      imports: [PaymentProviderModule.forRootAsync(options)],
    };
  }
}