import { EntityManager, Type } from '@mikro-orm/core';
import { Controller, Injectable } from '@nestjs/common';
import { botOfferDto } from 'src/mikroorm/dto/create-offer.dto';
import { Arbitraries } from 'src/mikroorm/entities/Arbitraries';
import { Offers, OffersFeePayer } from 'src/mikroorm/entities/Offers';
import { BasePaymentController, paymentURL } from 'src/types/interfaces';
import { BtcCoreService } from './btc-core.service';
import { AppConfigService } from '../../app-config/app-config.service'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { HttpService } from '@nestjs/axios'
import { uuid } from 'uuidv4';
import { Invoices, InvoicesType } from 'src/mikroorm/entities/Invoices';
import { response } from 'express';
const Client = require('bitcoin-core');
const axios = require('axios').default;


@Controller()
export class BtcCoreController extends BasePaymentController {
  init = async () => {
    try {
      const _wallet = this.AppConfigService.get('BTC_WALLET') || '11'
      const _btc_password = this.AppConfigService.get('BTC_PASSWORD') || 'bitcoinpassword'
      const _btc_user = this.AppConfigService.get('BTC_USER') || 'bitcoinuser'
      const _network = this.AppConfigService.get('BTC_NETWORK') || 'testnet'
      const _btc_port = this.AppConfigService.get('BTC_PORT') || '18332'
      const _confirmations = this.AppConfigService.get('BTC_CONFIRMATIONS') || 0
      const _updateTimeout = this.AppConfigService.get('BTC_UPDATE_TIMEOUT') * 1000 || 5000
      const _incomingTimeout = this.AppConfigService.get('BTC_INCOMING_TIMEOUT') * 1000 || 10 * 60 * 1000
      const _outgoingTimeout = this.AppConfigService.get('BTC_OUTGOING_TIMEOUT') * 1000 || 10 * 60 * 1000
      this.client = new Client({ network: _network, port: _btc_port, password: _btc_password, username: _btc_user, wallet: _wallet });
      //await this.client.getInfo()
      const response = await axios.get('https://cdn.moneyconvert.net/api/latest.json')
      if (!(response.data && response.data.rates)) throw new Error("");
    } catch (error) {
      this.logger.error('BtcCoreController init failed!')
      //! uncomment
      process.exit(1)
    }
  }
  constructor(
    @InjectPinoLogger('BtcCoreController') private readonly logger: PinoLogger,
    private readonly btcCoreService: BtcCoreService,
    private readonly AppConfigService: AppConfigService,
    private readonly em: EntityManager,
  ) {
    super()
  }
  private client: any
  getPayLink = async (offer: Offers) => {
    const txn_id = uuid()
    const feeRub = Math.max(offer.offerValue * offer.paymentMethod.feePercent / 100, offer.paymentMethod.feeRaw)
    const priceRub = offer.offerValue + feeRub * (offer.feePayer === OffersFeePayer.BUYER ? 1 : 0)
    const valuesBtc = await this.rubToBTC([feeRub, priceRub])
    const url = await this.client.getNewAddress(txn_id)
    const invoice = new Invoices()
    invoice.type = InvoicesType.IN
    invoice.currency = 'BTC'
    invoice.value = Number(valuesBtc[1])
    invoice.fee = Number(valuesBtc[0])
    invoice.txnId = txn_id
    invoice.url = url
    invoice.offer = this.em.getReference(Offers, offer.id)
    invoice.invoiceStatus = this.em.getReference(Offers, this.AppConfigService.invoiceStatus('waiting').id)
    await this.em.persistAndFlush(invoice)
    return { url: url, id: txn_id }
  }
  sellerWithdraw: (offer: botOfferDto) => Promise<string>;
  arbitraryWithdraw: (arb: Arbitraries) => Promise<string>;
  private rubToBTC = async (rub: number | number[]) => {
    const response: moneyconvertRes = await axios.get('https://cdn.moneyconvert.net/api/latest.json')
    if (Array.isArray(rub)) {
      return rub.map(i => ((response.data.rates.BTC / response.data.rates.RUB) * i).toFixed(8))
    } else {
      return ((response.data.rates.BTC / response.data.rates.RUB) * rub).toFixed(8)
    }
  }
}

type moneyconvertRes = { data: { rates: { RUB: number, BTC: number } } }