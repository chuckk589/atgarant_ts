import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { PAYMENTS_CONTROLLER } from 'src/constants';
import { PaymentsService } from './payments.service';
import { BasePaymentController } from 'src/types/interfaces';
import { CoinpaymentsDto } from './dto/coinpayments.dto';
import { QiwiPaymentsDto } from './dto/qiwipayments.dto';
import { AppEventsController } from "src/app-events/app-events.controller";

@Controller('payments')
export class PaymentsController {
  constructor(
    @Inject(PAYMENTS_CONTROLLER) private PaymentController: BasePaymentController,
    private readonly PaymentsService: PaymentsService,
    private readonly AppEventsController: AppEventsController,
  ) {
    this.PaymentController.init()
  }
  @Post('crypto')
  async cryptoEndPoint(@Body() CoinpaymentsDto: CoinpaymentsDto) {
    //incoming payment
    if (CoinpaymentsDto.status == 100) {
      await this.PaymentsService.registerPayment(CoinpaymentsDto.txn_id)
      await this.AppEventsController.offerPayed(CoinpaymentsDto.txn_id)
      //outgoing
    } else if (CoinpaymentsDto.status == 2) {
      await this.PaymentsService.registerPayment(CoinpaymentsDto.txn_id)
      await this.AppEventsController.offerPayoutProcessed(CoinpaymentsDto.txn_id)
    }
  }
  @Post('qiwi')
  async fiatQIWI(@Body() QiwiPaymentDto: any) {
    const payload = new QiwiPaymentsDto(QiwiPaymentDto)
    //incoming payment
    if (payload.status === 'PAID') {
      await this.PaymentsService.registerPayment(payload.txnId)
      await this.AppEventsController.offerPayed(payload.txnId)
    } else if (payload.status === 'SUCCESS') {
      await this.PaymentsService.registerPayment(payload.txnId)
      await this.AppEventsController.offerPayoutProcessed(payload.txnId)
    }
  }
}