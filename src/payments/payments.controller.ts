import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { PAYMENT_SERVICE } from 'src/constants';
import { BasePaymentService } from 'src/types/interfaces';
import { CoinpaymentsDto } from './dto/coinpayments.dto';
import {PaymentProviderController} from '../payment-provider/payment-provider.controller'

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly PaymentProviderController: PaymentProviderController
  ) {
console.log(this.PaymentProviderController)
  }
  @Post('crypto')
  create(@Body() CoinpaymentsDto: CoinpaymentsDto) {
    if (CoinpaymentsDto.status == 100) {

    }
  }
}
// router.post('/crypto/', async (req, res) => {
//   try {
//       if (req.body && req.body.status) {
//           if (req.body.status === '100') {//incoming payment
//               //example body
              // {
              //     amount1: '1210',
              //     amount2: '0.08849',
              //     buyer_name: 'CoinPayments API',
              //     currency1: 'RUB',
              //     currency2: 'LTCT',
              //     email: 'chuckk589@gmail.com',
              //     fee: '0.00044',
              //     ipn_id: 'ba613a910478e8b3cfef2a82ab903180',
              //     ipn_mode: 'hmac',
              //     ipn_type: 'api',
              //     ipn_version: '1.0',
              //     merchant: '063a9bd44178898cf1c5b172a1117e93',
              //     net: '0.08805',
              //     received_amount: '0.08849',
              //     received_confirms: '0',
              //     status: '100',
              //     status_text: 'Complete',
              //     txn_id: 'CPFJ6ZAHDSDDHE8A7LXIIPGGOA'
              //   }
//               await invoice.update({
//                   invoiceStatusId: sequelize.literal(`(SELECT id from invoicestatuses WHERE value = 'success')`)
//               }, {
//                   where: {
//                       txn_id: req.body.txn_id
//                   }
//               })
//                   .then(r => {
//                       if (!!r[0]) botEvents.offerPayed(req.body.txn_id)
//                   })
//           } else if (req.body.status === '2') {//outgoing payment proccessed
//               //example body
//               // {
//               //     address: 'mhCEdMq9HBSQc5vr9pPRPzoGnWHTgPWG55',
//               //     amount: '0.00757475',
//               //     amounti: '757475',
//               //     currency: 'LTCT',
//               //     id: 'CWFJ1YOQISKTMP0G54UX7SNSA0',
//               //     ipn_id: '3fa17cdc50216b4b9fdcb9b3fc38a027',
//               //     ipn_mode: 'hmac',
//               //     ipn_type: 'withdrawal',
//               //     ipn_version: '1.0',
//               //     merchant: '063a9bd44178898cf1c5b172a1117e93',
//               //     status: '2',
//               //     status_text: 'Complete',
//               //     txn_id: 'db75b5a55b99fe2c892f7d6bad4415e1ed59769660ce1cb43ece0e98bb7c792a'
//               //   }
//               await invoice.update({
//                   invoiceStatusId: sequelize.literal(`(SELECT id from invoicestatuses WHERE value = 'success')`)
//               }, {
//                   where: {
//                       txn_id: req.body.id
//                   }
//               })
//                   .then(r => {
//                       if (!!r[0]) botEvents.offerPayoutProcessed(req.body.id)
//                   })
//           }
//       }
//       res.send('ok')
//   } catch (error) {
//       console.log(error)
//       res.send(error)
//   }
// })
// router.post('/qiwi/', async (req, res) => {
//   console.log(req.body)
//   if (req.body && req.body.bill && req.body.bill.status.value === 'PAID') {//incoming
//       //example body
//       // req.body = {
//       //     "bill": {
//       //       "siteId": "9hh4jb-00",
//       //       "billId": "cc961e8d-d4d6-4f02-b737-2297e51fb48e",
//       //       "amount": {
//       //         "value": "1.00",
//       //         "currency": "RUB"
//       //       },
//       //       "status": {
//       //         "value": "PAID",
//       //         "changedDateTime": "2021-01-18T15:25:18+03"
//       //       },
//       //       "customer": {
//       //         "phone": "78710009999",
//       //         "email": "test@tester.com",
//       //         "account": "454678"
//       //       },
//       //       "customFields": {
//       //         "paySourcesFilter": "qw",
//       //         "themeCode": "Yvan-YKaSh",
//       //         "yourParam1": "64728940",
//       //         "yourParam2": "order 678"
//       //       },
//       //       "comment": "Text comment",
//       //       "creationDateTime": "2021-01-18T15:24:53+03",
//       //       "expirationDateTime": "2025-12-10T09:02:00+03"
//       //     },
//       //     "version": "1"
//       //   }
//       invoice.update({
//           invoiceStatusId: sequelize.literal(`(SELECT id from invoicestatuses WHERE value = 'success')`)
//       }, {
//           where: {
//               txn_id: req.body.bill.billId
//           }
//       })
//       botEvents.offerPayed(req.body.bill.billId)
//       //botEvents.offerPayed(targetOffer.id)
//   } else if (req.body && req.body.payment && req.body.payment.status === 'SUCCESS') {//outgoing
//       //exmp
//       // {
//       //     messageId: '5921e94b-d363-421e-97c5-7a3e30a3b5d4',
//       //     hookId: '78c7b072-8abc-4f5c-867c-c5ef38ef0a05',
//       //     payment: {
//       //       txnId: '23788602805',
//       //       date: '2021-11-09T15:34:56+03:00',
//       //       type: 'OUT',
//       //       status: 'SUCCESS',
//       //       errorCode: '0',
//       //       personId: 79161724726,
//       //       account: '+79851291007',
//       //       comment: '',
//       //       provider: 99,
//       //       sum: { amount: 1, currency: 643 },
//       //       commission: { amount: 0.02, currency: 643 },
//       //       total: { amount: 1.02, currency: 643 },
//       //       signFields: 'sum.currency,sum.amount,type,account,txnId'
//       //     },
//       //     hash: '54339d26eda9ae000da84a16ed68d811a218af84e4c44011401b2a9c66df5cd5',
//       //     version: '1.0.0',
//       //     test: false
//       //   }
//       invoice.update({
//           invoiceStatusId: sequelize.literal(`(SELECT id from invoicestatuses WHERE value = 'success')`)
//       }, {
//           where: {
//               txn_id: req.body.payment.txnId
//           }
//       })
//           .then(r => {
//               if (!!r[0]) botEvents.offerPayoutProcessed(req.body.payment.txnId)
//           })
//   }
//   res.send('ok')
// })


// module.exports = router;