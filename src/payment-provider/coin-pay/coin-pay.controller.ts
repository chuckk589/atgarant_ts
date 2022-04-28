import { Controller, Injectable } from '@nestjs/common';
import Coinpayments from 'coinpayments';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { botOfferDto } from 'src/mikroorm/dto/create-offer.dto';
import { Offers, OffersFeePayer } from 'src/mikroorm/entities/Offers';
import { EntityManager } from '@mikro-orm/core';
import { Invoices, InvoicesType } from 'src/mikroorm/entities/Invoices';
import { Arbitraries, ArbitrariesStatus } from 'src/mikroorm/entities/Arbitraries';
import { BasePaymentController, paymentURL } from 'src/types/interfaces';
import { CoinPayService } from './coin-pay.service';
import { AppConfigService } from '../../app-config/app-config.service'
import { getInvoiceValue, getInvoiceFee } from 'src/bot/common/helpers';
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
      this.client = new Coinpayments({ key: this.options.coin_api_key, secret: this.options.coin_api_key_secret })
      this.qiwiApi = new QiwiBillPaymentsAPI(this.options.qiwi_p2p_token_secret);
      //console.log(await this.client.balances())
      //TODO: check Coinpayments, QiwiBillPaymentsAPI accessibility
      //TODO: required params
    } catch (error) {
      console.log(error)
      this.logger.error('CoinPayController init failed!')
      process.exit(1)
    }
  };
  constructor(
    @InjectPinoLogger('CoinPayController') private readonly logger: PinoLogger,
    private readonly coinPayService: CoinPayService,
    private readonly AppConfigService: AppConfigService,
  ) {
    super()
  }
  client: Coinpayments
  qiwiApi: any
  options: CoinPayOptions
  private rubToCurrency = async (rub: number, code: string) => {
    const data = await this.client.rates()
    if (Array.isArray(rub)) {
      return rub.map(i => ((Number(data.RUB.rate_btc) / Number(data[code].rate_btc)) * i).toFixed(8))
    } else {
      return ((Number(data.RUB.rate_btc) / Number(data[code].rate_btc)) * rub).toFixed(8)
    }
  }
  getPayLink = async (offer: Offers): Promise<paymentURL> => {
    const feeRub = Math.max(offer.offerValue * offer.paymentMethod.feePercent / 100, offer.paymentMethod.feeRaw)
    const priceRub = offer.offerValue + feeRub * (offer.feePayer === OffersFeePayer.BUYER ? 1 : 0)
    const currency = offer.paymentMethod.value.split('_').pop()
    if (offer.paymentMethod.value == 'paymentMethod_QIWI' || offer.paymentMethod.value == 'paymentMethod_CARD') {
      const method = currency === 'QIWI' ? 'qw' : 'card'
      const billId = this.qiwiApi.generateId();
      const response = await this.qiwiApi.createBill(billId, { amount: priceRub, currency: 'RUB', comment: `Заказ id: ${offer.id}`, customFields: { paySourcesFilter: method } })
      await this.coinPayService.createInvoice({ type: InvoicesType.IN, currency: currency, value: response.amount.value, fee: feeRub, txnId: response.billId, url: response.payUrl, offer: { id: offer.id } })
      return { url: response.payUrl, id: response.billId }
    } else {
      const feeCrypto = await this.rubToCurrency(feeRub, currency)
      const CoinpaymentsCreateTransactionOpts = { currency1: 'RUB', currency2: currency, buyer_email: 'chuckk589@gmail.com', amount: priceRub }
      const response = await this.client.createTransaction(CoinpaymentsCreateTransactionOpts)
      await this.coinPayService.createInvoice({ type: InvoicesType.IN, currency: currency, value: Number(response.amount), fee: Number(feeCrypto), txnId: response.txn_id, url: response.checkout_url, offer: { id: offer.id } })
      return { url: response.checkout_url, id: response.txn_id }
    }
  }
  withDraw = async (amount: number, address: string, type: InvoicesType, offerId: number, currency: string) => {
    if (currency === 'QIWI') {
      const qiwiResponse = await this.coinPayService.createQiwiTransaction(amount, address)
      await this.coinPayService.createInvoice({ type: type, currency: 'QIWI', value: amount, txnId: qiwiResponse, offer: { id: offerId } })
    } else if (currency === 'CARD') {
      const id = await this.coinPayService.createCardTransaction(amount, address)
      await this.coinPayService.createInvoice({ type: type, currency: 'CARD', value: amount, txnId: id, offer: { id: offerId } })
    } else {
      const CoinpaymentsCreateWithdrawalOpts = { amount: amount, currency: currency, address: address }
      const response = await this.client.createWithdrawal(CoinpaymentsCreateWithdrawalOpts)
      await this.coinPayService.createInvoice({ type: type, currency: currency, value: Number(response.amount), txnId: response.id, offer: { id: offerId } })
    }
  }
  sellerWithdraw = async (offer: Offers) => {
    const sellerPayout = getInvoiceValue(offer.invoices) + getInvoiceFee(offer.invoices) * (offer.feePayer == OffersFeePayer.BUYER ? 0 : -1)
    const currency = offer.paymentMethod.value.split('_').pop()
    await this.withDraw(sellerPayout, offer.sellerWalletData, InvoicesType.OUT, offer.id, currency)
  }
  arbitraryWithdraw = async (arb: Arbitraries) => {
    const totalValue = getInvoiceValue(arb.offer.invoices)
    const sellerPayout = totalValue * arb.sellerPayout / 100
    const buyerPayout = totalValue * arb.buyerPayout / 100
    const timeout = arb.status == ArbitrariesStatus.CLOSED ? 12 * 60 * 60 * 1000 : 0 //12 hours timeout for 'closed' status
    setTimeout(async () => {
      const isAllOk = await this.coinPayService.getArbState(arb)
      if (isAllOk) {
        const currency = arb.offer.paymentMethod.value.split('_').pop()
        //seller
        if (sellerPayout) {
          await this.withDraw(sellerPayout, arb.offer.sellerWalletData, InvoicesType.REFUND, arb.offer.id, currency)
        }
        //buyer
        if (buyerPayout) {
          await this.withDraw(buyerPayout, arb.offer.buyerWalletData, InvoicesType.REFUND, arb.offer.id, currency)
        }
      }
    }, timeout);
  }
}
