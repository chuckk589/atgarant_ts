import { Injectable } from '@nestjs/common';
import { BasePaymentService, paymentURL } from 'src/types/interfaces';
import { AppConfigService } from '../app-config/app-config.controller'
import Coinpayments from 'coinpayments';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { botOfferDto } from 'src/mikroorm/dto/create-offer.dto';
import { Offers, OffersFeePayer } from 'src/mikroorm/entities/Offers';
import { EntityManager } from '@mikro-orm/core';
import { Invoices, InvoicesType } from 'src/mikroorm/entities/Invoices';
import { Arbitraries } from 'src/mikroorm/entities/Arbitraries';
const QiwiBillPaymentsAPI = require('@qiwi/bill-payments-node-js-sdk');

@Injectable()
export class CoinPaymentsService extends BasePaymentService {
  constructor(
    private readonly AppConfigService: AppConfigService,
    private readonly em: EntityManager,
    @InjectPinoLogger('CoinPaymentsService') private readonly logger: PinoLogger
  ) {
    super()
    const _COIN_API_KEY = this.AppConfigService.get('COIN_API_KEY')
    const _COIN_API_KEY_SECRET = this.AppConfigService.get('COIN_API_KEY_SECRET')
    const _QIWI_P2P_TOKEN_SECRET = this.AppConfigService.get('QIWI_P2P_TOKEN_SECRET')
    if (!(_QIWI_P2P_TOKEN_SECRET && _COIN_API_KEY_SECRET && _COIN_API_KEY)) {
      this.logger.error('CoinPaymentsService some token is not present!')
      process.exit(1)
    }
    this.client = new Coinpayments({ key: _COIN_API_KEY, secret: _COIN_API_KEY_SECRET })
    this.qiwiApi = new QiwiBillPaymentsAPI(_QIWI_P2P_TOKEN_SECRET);
  }
  client: Coinpayments
  qiwiApi: any
  getPayLink = async (offer: Offers): Promise<paymentURL> => {
    const feeRub = Math.max(offer.offerValue * offer.paymentMethod.feePercent / 100, offer.paymentMethod.feeRaw)
    const priceRub = offer.offerValue + feeRub * (offer.feePayer === OffersFeePayer.BUYER ? 1 : 0)
    if (offer.paymentMethod.value === 'paymentMethod_QIWI' || offer.paymentMethod.value === 'paymentMethod_CARD') {
      const method = offer.paymentMethod.value.split('_').pop() === 'QIWI' ? 'qw' : 'card'
      const fields = {
        amount: priceRub,
        currency: 'RUB',
        comment: `Заказ id${offer.id}`,
        customFields: { paySourcesFilter: method }
      };
      const billId = this.qiwiApi.generateId();
      const response = await this.qiwiApi.createBill(billId, fields)
      if (!response) throw new Error(`qiwiApi.createBill response is empty offer-id: ${offer.id}`)
      const invoice = new Invoices()
      invoice.type = InvoicesType.IN
      invoice.currency = offer.paymentMethod.value.split('_').pop()
      invoice.value = response.amount.value
      invoice.fee = feeRub
      invoice.txnId = response.billId
      invoice.url = response.payUrl
      invoice.offer = this.em.getReference(Offers, offer.id)
      invoice.invoiceStatus = this.em.getReference(Offers, this.AppConfigService.invoiceStatus('waiting').id)
      await this.em.persistAndFlush(invoice)
      return { url: response.payUrl, id: response.billId }
    } else {
      const currency = offer.paymentMethod.value.split('_').pop()
      const feeCrypto = await this.rubToCurrency(feeRub, currency)
      const CoinpaymentsCreateTransactionOpts = {
        currency1: 'RUB',
        currency2: currency,
        buyer_email: 'chuckk589@gmail.com',
        amount: priceRub,
      }
      const response = await this.client.createTransaction(CoinpaymentsCreateTransactionOpts)
      if (!response) throw new Error(`client.createTransaction response is empty offer-id: ${offer.id}`)
      const invoice = new Invoices()
      invoice.type = InvoicesType.IN
      invoice.currency = currency
      invoice.value = Number(response.amount)
      invoice.fee = Number(feeCrypto)
      invoice.txnId = response.txn_id
      invoice.url = response.checkout_url
      invoice.offer = this.em.getReference(Offers, offer.id)
      invoice.invoiceStatus = this.em.getReference(Offers, this.AppConfigService.invoiceStatus('waiting').id)
      await this.em.persistAndFlush(invoice)
      return { url: response.checkout_url, id: response.txn_id }
    }
  }
  // arbitraryWithdraw = async (arb: Arbitraries) => {
  //   const sellerPayout = arb.offer.invoices[0].value * arb.sellerPayout / 100
  //   const buyerPayout = arb.offer.invoices[0].value * arb.buyerPayout / 100
  //   const timeout = arb.status === 'closed' ? 12 * 60 * 60 * 1000 : 0 //12 hours timeout for 'closed' status
  //   //console.log(arb)
  //   setTimeout(async () => {
  //     const arb = await arbitrary.findOne({ where: { id: arb.id } })
  //     if (!(arb.status === 'closedF' && arb.status === 'closed')) {//check if offer was disputed during timeout 
  //       arbitrary.update({ status: 'closedF' }, { where: { id: arb.id } })
  //         .then(() => {
  //           const currency = arb.offer.paymentMethod.value.split('_').pop()
  //           //seller
  //           if (sellerPayout) {
  //             this.withDraw(sellerPayout, arb.offer.sellerWalletData, currency, 'refund', arb.offer.id)
  //           }
  //           //buyer
  //           if (buyerPayout) {
  //             this.withDraw(buyerPayout, arb.offer.buyerWalletData, currency, 'refund', arb.offer.id)
  //           }
  //         })

  //     }
  //   }, timeout);
  // }
//   sellerWithdraw = async (offerData) => {
//     const sellerPayout = + offerData.invoices[0].value + +offerData.invoices[0].fee * (offerData.feePayer === 'buyer' ? 0 : -1)
//     this.withDraw(sellerPayout, offerData.sellerWalletData, offerData.paymentMethod.value.split('_').pop(), 'out', offerData.id)
//         .catch(er => console.log(er))
// }
// withDraw = async (amount, address, currency, type, offerId) => {
//     return new Promise((res, rej) => {
//         if (currency === 'QIWI') {
//             const body = {
//                 "id": uuidv4(),
//                 "sum": {
//                     "amount": amount,
//                     "currency": "643"
//                 },
//                 "paymentMethod": {
//                     "type": "Account",
//                     "accountId": "643"
//                 },
//                 "fields": {
//                     "account": address
//                 }
//             }
//             axios.post(`https://edge.qiwi.com/sinap/api/v2/terms/99/payments`, body, { headers: { 'Authorization': `Bearer ${process.env.QIWI_API_TOKEN}` } })
//                 .then(r => {
//                     if (r.data.code) {
//                         invoice.create({
//                             type: type,
//                             currency: 'QIWI',
//                             value: amount,
//                             invoiceStatusId: sequelize.literal(`(SELECT id from invoicestatuses WHERE value = 'waiting')`),
//                             txn_id: r.data.transaction.id,
//                             offerId: offerId
//                         }).then(res)
//                     } else {
//                         rej(r.data.message)
//                     }
//                 })
//                 .catch(rej)
//         } else if (currency === 'CARD') {
//             const bodyFormData = new FormData();
//             bodyFormData.append('cardNumber', address);
//             axios.post('https://qiwi.com/card/detect.action', bodyFormData, { headers: bodyFormData.getHeaders() })
//                 .then(r => {
//                     if (r.data && r.data.code.value !== 0) {
//                         const cardCode = r.data.message
//                         axios.post(`https://edge.qiwi.com/sinap/api/v2/terms/${cardCode}/payments`, {
//                             "id": Date.now().toString(),
//                             "sum": {
//                                 "amount": amount,
//                                 "currency": "643"
//                             },
//                             "paymentMethod": {
//                                 "type": "Account",
//                                 "accountId": "643"
//                             },
//                             "fields": {
//                                 "account": address
//                             }
//                         }, { headers: { 'Authorization': `Bearer ${process.env.QIWI_API_TOKEN}` } })
//                             .then(r => {
//                                 //response example
//                                 // data: {
//                                 //     terms: '31652',
//                                 //     fields: { account: '2202200239511759' },
//                                 //     sum: { amount: 1, currency: '643' },
//                                 //     transaction: { id: '23726243543', state: [Object] },
//                                 //     source: 'account_643'
//                                 //   }
//                                 invoice.create({
//                                     type: type,
//                                     currency: 'CARD',
//                                     value: amount,
//                                     invoiceStatusId: sequelize.literal(`(SELECT id from invoicestatuses WHERE value = 'waiting')`),
//                                     txn_id: r.data.transaction.id,
//                                     offerId: offerId
//                                 }).then(res)
//                             }).catch(rej)
//                     }
//                     //else probably wrong card number, do nothing?
//                 }).catch(rej)
//         } else {
//             const CoinpaymentsCreateWithdrawalOpts = {
//                 amount: amount,
//                 currency: currency,
//                 address: address
//             }
//             this.client.createWithdrawal(CoinpaymentsCreateWithdrawalOpts)
//                 .then(response => {
//                     invoice.create({
//                         type: type,
//                         currency: currency,
//                         value: response.amount,
//                         invoiceStatusId: sequelize.literal(`(SELECT id from invoicestatuses WHERE value = 'waiting')`),
//                         txn_id: response.id,
//                         offerId: offerId
//                     })
//                         .then(res)
//                 })
//                 .catch(rej)
//         }
//     })
// }
  private rubToCurrency = async (rub: number, code: string) => {
    const data = await this.client.rates()
    if (Array.isArray(rub)) {
      return rub.map(i => ((Number(data.RUB.rate_btc) / Number(data[code].rate_btc)) * i).toFixed(8))
    } else {
      return ((Number(data.RUB.rate_btc) / Number(data[code].rate_btc)) * rub).toFixed(8)
    }
  }
}
