import { EntityManager, Type } from '@mikro-orm/core';
import { Controller, Injectable } from '@nestjs/common';
import { botOfferDto } from 'src/mikroorm/dto/create-offer.dto';
import { Arbitraries, ArbitrariesStatus } from 'src/mikroorm/entities/Arbitraries';
import { Offers, OffersFeePayer } from 'src/mikroorm/entities/Offers';
import { BasePaymentController, paymentURL, WithDrawOptions } from 'src/types/interfaces';
import { BtcCoreService } from './btc-core.service';
import { AppConfigService } from '../../app-config/app-config.service'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { uuid } from 'uuidv4';
import { AppEventsController } from 'src/app-events/app-events.controller'
import { InvoicesType } from 'src/mikroorm/entities/Invoices';

import { getInvoiceFee, getInvoiceValue } from 'src/bot/common/helpers';


const Client = require('bitcoin-core');


type BtcCoreOptions = {
  wallet: string
  btc_password: string
  btc_user: string
  network: 'testnet' | 'mainnet'
  btc_port: number
  confirmations: number
  updateTimeout: number
  incomingTimeout: number
  outgoingTimeout: number
}

@Controller()
export class BtcCoreController extends BasePaymentController {
  constructor(
    @InjectPinoLogger('BtcCoreController') private readonly logger: PinoLogger,
    private readonly btcCoreService: BtcCoreService,
    private readonly AppConfigService: AppConfigService,
    private readonly AppEventsController: AppEventsController,
  ) {
    super()
    console.log(('BtcCore constructor'))
  }
  options: BtcCoreOptions
  test: number
  private client: any
  init = async () => {
    try {
      this.options = {
        wallet: this.AppConfigService.get('BTC_WALLET') || '11',
        btc_password: this.AppConfigService.get('BTC_PASSWORD') || 'bitcoinpassword',
        btc_user: this.AppConfigService.get('BTC_USER') || 'bitcoinuser',
        network: this.AppConfigService.get('BTC_NETWORK') || 'testnet',
        btc_port: this.AppConfigService.get('BTC_PORT') || 18332,
        confirmations: this.AppConfigService.get('BTC_CONFIRMATIONS') || 0,
        updateTimeout: this.AppConfigService.get('BTC_UPDATE_TIMEOUT') * 1000 || 5000,
        incomingTimeout: this.AppConfigService.get('BTC_INCOMING_TIMEOUT') * 1000 || 10 * 60 * 1000,
        outgoingTimeout: this.AppConfigService.get('BTC_OUTGOING_TIMEOUT') * 1000 || 10 * 60 * 1000,
      }
      //TODO: set minimum uodate timeout
      //TODO: set required params
      this.client = new Client({ network: this.options.network, port: this.options.btc_port, password: this.options.btc_password, username: this.options.btc_user, wallet: this.options.wallet });
      //TODO: uncomment
      //await this.client.ping()
      const state = await this.btcCoreService.checkMoneyConvert()
      if (!state) throw new Error("Money convert service is not accesible");
    } catch (error) {
      this.logger.error('BtcCoreController init failed!')
      process.exit(1)
    }
  }

  worker = async () => {
    console.log('worker call')
    const invoices = await this.btcCoreService.fetchMatchingInvoices(this.options.incomingTimeout, this.options.outgoingTimeout)
    for (const i of invoices.incoming) {
      const receivedAmount = await this.client.getReceivedByLabel(i.txnId, this.options.confirmations)
      if (typeof receivedAmount == 'number' && receivedAmount >= i.value) {
        await this.AppEventsController.offerPayed(i.txnId)
        this.logger.info(`Payment received txnId: ${i.txnId} value: ${i.value}`)
      }
    }
    for (const i of invoices.outgoing) {
      const transactionDetails = await this.client.getTransaction(i.txnId)
      if (typeof transactionDetails == 'object' && transactionDetails.confirmations >= this.options.confirmations) {
        await this.AppEventsController.offerPayoutProcessed(i.txnId)
        this.logger.info(`Payment sent txnId: ${i.txnId} value: ${i.value}`)
      }
    }
    setTimeout(this.worker, this.options.updateTimeout);
  }
  getPayLink = async (offer: Offers): Promise<paymentURL> => {
    const txn_id = uuid()
    const url = await this.client.getNewAddress(txn_id)
    await this.btcCoreService.createIncomingTransaction(offer, txn_id, url)
    return { url: url, id: txn_id }
  }
  sellerWithdraw = async (offer: Offers) => {
    const sellerPayout = getInvoiceValue(offer.invoices) + getInvoiceFee(offer.invoices) * (offer.feePayer == OffersFeePayer.BUYER ? 0 : -1)
    await this.withDraw(sellerPayout, offer.sellerWalletData, InvoicesType.OUT, offer.id, 'BTC')
  }
  arbitraryWithdraw = async (arb: Arbitraries) => {
    const totalValue = getInvoiceValue(arb.offer.invoices)
    const sellerPayout = totalValue * arb.sellerPayout / 100
    const buyerPayout = totalValue * arb.buyerPayout / 100
    const timeout = arb.status == ArbitrariesStatus.CLOSED ? 12 * 60 * 60 * 1000 : 0 //12 hours timeout for 'closed' status
    setTimeout(async () => {
      const isAllOk = await this.btcCoreService.getArbState(arb)
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
  };
  withDraw = async (amount: number, address: string, type: InvoicesType, offerId: number, currency: string = 'BTC') => {
    const response = await this.client.sendToAddress(address, amount)
    await this.btcCoreService.createInvoice({ type: type, currency: currency, value: amount, txnId: response, offer: { id: offerId } })
  }



}