import { PaymentsService } from './payments.service';
import { BasePaymentController } from 'src/types/interfaces';
import { CoinpaymentsDto } from './dto/coinpayments.dto';
import { AppEventsController } from 'src/app-events/app-events.controller';
export declare class PaymentsController {
    private PaymentController;
    private readonly PaymentsService;
    private readonly AppEventsController;
    constructor(PaymentController: BasePaymentController, PaymentsService: PaymentsService, AppEventsController: AppEventsController);
    cryptoEndPoint(CoinpaymentsDto: CoinpaymentsDto): Promise<void>;
    fiatQIWI(QiwiPaymentDto: any): Promise<void>;
}
