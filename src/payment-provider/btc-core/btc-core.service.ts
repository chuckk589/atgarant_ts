import { EntityData, EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Invoices, InvoicesType } from 'src/mikroorm/entities/Invoices';
import { Offers, OffersFeePayer } from 'src/mikroorm/entities/Offers';
import axios from 'axios';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Arbitraries, ArbitrariesStatus } from 'src/mikroorm/entities/Arbitraries';
import { Offerstatuses } from 'src/mikroorm/entities/Offerstatuses';

type MoneyConvertResponse = {
  rates: {
    RUB: number;
    BTC: number;
  };
};

type InvoicesResponse = {
  incoming: Invoices[];
  outgoing: Invoices[];
};

@Injectable()
export class BtcCoreService {
  constructor(private readonly em: EntityManager, private readonly AppConfigService: AppConfigService) {}
  async getArbState(oldArb: Arbitraries): Promise<boolean> {
    try {
      const arb = await this.em.findOneOrFail(Arbitraries, { id: oldArb.id });
      //check if offer was disputed during timeout
      if (!(arb.status === ArbitrariesStatus.CLOSEDF && oldArb.status === ArbitrariesStatus.CLOSED)) {
        arb.status = ArbitrariesStatus.CLOSEDF;
        await this.em.persistAndFlush(arb);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  async createIncomingTransaction(offer: Offers, txn_id: string, url: string) {
    const feeRub = Math.max((offer.offerValue * offer.paymentMethod.feePercent) / 100, offer.paymentMethod.feeRaw);
    const priceRub = offer.offerValue + feeRub * (offer.feePayer === OffersFeePayer.BUYER ? 1 : 0);
    const valuesBtc = await this.rubToBTC([feeRub, priceRub]);
    await this.createInvoice({
      type: InvoicesType.IN,
      currency: 'BTC',
      value: Number(valuesBtc[1]),
      url: url,
      fee: Number(valuesBtc[0]),
      txnId: txn_id,
      offer: { id: offer.id },
    });
  }
  async createInvoice(options: EntityData<Invoices>) {
    options.invoiceStatus = this.em.getReference(
      Offerstatuses,
      this.AppConfigService.invoiceStatus<string>('waiting').id,
    );
    const invoice = this.em.create(Invoices, options);
    await this.em.persistAndFlush(invoice);
  }
  async fetchMatchingInvoices(incomingTimeout: number, outgoingTimeout: number): Promise<InvoicesResponse> {
    const allInvoices = await this.em.find(Invoices, {
      currency: 'BTC',
      invoiceStatus: { value: 'waiting' },
    });
    //TODO: close / delete rest invoices (outdated)
    return {
      incoming: allInvoices.filter(
        (i) => i.createdAt > new Date(Date.now() - incomingTimeout) && i.type == InvoicesType.IN,
      ),
      outgoing: allInvoices.filter(
        (i) => i.createdAt > new Date(Date.now() - outgoingTimeout) && i.type == InvoicesType.OUT,
      ),
    };
  }

  private rubToBTC = async (rub: number | number[]) => {
    const response = await axios.get<MoneyConvertResponse>('https://cdn.moneyconvert.net/api/latest.json');
    if (Array.isArray(rub)) {
      return rub.map((i) => ((response.data.rates.BTC / response.data.rates.RUB) * i).toFixed(8));
    } else {
      return ((response.data.rates.BTC / response.data.rates.RUB) * rub).toFixed(8);
    }
  };
  async checkMoneyConvert(): Promise<boolean> {
    try {
      const response = await axios.get<MoneyConvertResponse>('https://cdn.moneyconvert.net/api/latest.json');
      if (response.data && response.data.rates) return true;
    } catch (error) {
      return false;
    }
  }
}
