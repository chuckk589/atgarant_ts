import { DynamicModule } from '@nestjs/common';
import { PaymentsOptionsAsync } from 'src/types/interfaces';
export declare class PaymentProviderModule {
    static forRootAsync(options?: PaymentsOptionsAsync): DynamicModule;
}
