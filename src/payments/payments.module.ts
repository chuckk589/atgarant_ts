import { DynamicModule, Module, Provider } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { GrammyBotOptions, PaymentsOptions, PaymentsOptionsAsync } from 'src/types/interfaces';
import { createBotFactory } from 'src/common/factories';
import { PAYMENTS_CONTROLLER } from 'src/constants';
import { PaymentProviderModule } from 'src/payment-provider/payment-provider.module';
import { PaymentsService } from './payments.service';
import { AppEventsModule } from 'src/app-events/app-events.module';


@Module({
  controllers: [PaymentsController],
  imports: [PaymentProviderModule.forRootAsync(), AppEventsModule],
  providers: [PaymentsService]
})
export class PaymentsModule {
  // public static forRootAsync(options: PaymentsOptionsAsync): DynamicModule {
  //   return {
  //     module: PaymentsModule,
  //     imports: [PaymentProviderModule.forRootAsync(options)],
  //   };
  // }
}