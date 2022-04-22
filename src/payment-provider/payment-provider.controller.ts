import { Controller, Inject } from '@nestjs/common';
import { PAYMENT_SERVICE } from 'src/constants';
import { BasePaymentService } from 'src/types/interfaces';

@Controller()
export class PaymentProviderController {
  constructor(
    @Inject(PAYMENT_SERVICE) private readonly paymentService: BasePaymentService
  ) {
    console.log(this.paymentService)
  }
}
