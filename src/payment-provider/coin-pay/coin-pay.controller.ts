import { Controller, Injectable } from '@nestjs/common';
import Coinpayments from 'coinpayments';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { botOfferDto } from 'src/mikroorm/dto/create-offer.dto';
import { Offers, OffersFeePayer } from 'src/mikroorm/entities/Offers';
import { EntityManager } from '@mikro-orm/core';
import { Invoices, InvoicesType } from 'src/mikroorm/entities/Invoices';
import { Arbitraries } from 'src/mikroorm/entities/Arbitraries';
import { BasePaymentController, paymentURL } from 'src/types/interfaces';
import { CoinPayService } from './coin-pay.service';
import { AppConfigService } from '../../app-config/app-config.service'
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');

type CoinPayOptions = {
  coin_api_key: string
  coin_api_key_secret: string
  qiwi_p2p_token_secret: string
}

@Controller()
export class CoinPayController extends BasePaymentController {
  init = async () => {
    try {
      this.options = {
        coin_api_key: this.AppConfigService.get('COIN_API_KEY'),
        coin_api_key_secret: this.AppConfigService.get('COIN_API_KEY_SECRET'),
        qiwi_p2p_token_secret: this.AppConfigService.get('QIWI_P2P_TOKEN_SECRET'),
      }
      console.log(this.options)
      this.client = new Coinpayments({ key: this.options.coin_api_key, secret: this.options.coin_api_key_secret })
      this.qiwiApi = new QiwiBillPaymentsAPI(this.options.qiwi_p2p_token_secret);
      //this.client.balances()
      //TODO: required params
    } catch (error) {
      console.log(error)
      this.logger.error('CoinPayController init failed!')
      process.exit(1)
    }
  };
  sellerWithdraw: (offer: Offers) => Promise<void>;
  arbitraryWithdraw: (arb: Arbitraries) => Promise<void>;
  withDraw: (amount: number, address: string, type: InvoicesType, offerId: number, currency: string) => Promise<void>;
  constructor(
    private readonly coinPayService: CoinPayService,
    @InjectPinoLogger('CoinPayController') private readonly logger: PinoLogger,
    private readonly AppConfigService: AppConfigService,
  ) {
    super()
  }
  client: Coinpayments
  qiwiApi: any
  options: CoinPayOptions
  getPayLink = async (offer: Offers): Promise<paymentURL> => {
    return { url: 'https://', id: '' }
  }
}
