import { EntityData, EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Invoices, InvoicesType } from 'src/mikroorm/entities/Invoices';
import { uuid } from 'uuidv4';
import { AppConfigService } from 'src/app-config/app-config.service'
import axios from 'axios';
import { Arbitraries, ArbitrariesStatus } from 'src/mikroorm/entities/Arbitraries';
import { Offers } from 'src/mikroorm/entities/Offers';
import { Offerstatuses } from 'src/mikroorm/entities/Offerstatuses';


type QIWIresponse = {
    transaction: {
        id: string,
    }
};
type QIWICardCodeResponse = {
    code: {
        value: number,
    },
    message: number,
}
type QIWICreatePaymentResponse = {
    terms: number,
    fields: { account: string },
    sum: { amount: number, currency: number },
    transaction: { id: string, state: [Object] },
    source: string
}

@Injectable()
export class CoinPayService {
    constructor(
        private readonly em: EntityManager,
        private readonly AppConfigService: AppConfigService,
    ) { }
    async mockTransaction(options: EntityData<Invoices>) {
        const txn_id = uuid()
        await this.createInvoice({ type: options.type, currency: options.currency, value: options.value, fee: options.fee, txnId: txn_id, url: 'response.payUrl', offer: options.offer })
        const port = this.AppConfigService.get('port')
        setTimeout(() => {
            switch (options.type) {
                case InvoicesType.IN: {
                    if (options.currency == 'QIWI' || options.currency == 'CARD') {
                        axios.post(`http://localhost:${port}/payment/qiwi/`, {
                            bill: {
                                status: {
                                    value: 'PAID'
                                },
                                billId: txn_id
                            }
                        })
                    } else {
                        axios.post(`http://localhost:${port}/payment/crypto/`, {
                            status: '100',
                            txn_id: txn_id
                        })
                    }
                    break;
                }
                case InvoicesType.OUT: {
                    if (options.currency == 'QIWI' || options.currency == 'CARD') {
                        axios.post(`http://localhost:${port}/payment/qiwi/`, {
                            payment: {
                                status: 'SUCCESS',
                                txnId: txn_id
                            }
                        })
                    } else {
                        axios.post(`http://localhost:${port}/payment/crypto/`, {
                            status: '2',
                            txn_id: txn_id
                        })
                    }
                    break;
                }
            }
        }, 3 * 1000);
    }

    async createCardTransaction(amount: number, address: string): Promise<string> {
        const bodyFormData = new FormData();
        bodyFormData.append('cardNumber', address);
        const cardCode = await axios.post<QIWICardCodeResponse>('https://qiwi.com/card/detect.action', bodyFormData)
        if (cardCode.data.code.value == 0) {
            const body = {
                "id": Date.now().toString(),
                "sum": {
                    "amount": amount,
                    "currency": "643"
                },
                "paymentMethod": {
                    "type": "Account",
                    "accountId": "643"
                },
                "fields": {
                    "account": address
                }
            }
            const response = await axios.post<QIWICreatePaymentResponse>(
                `https://edge.qiwi.com/sinap/api/v2/terms/${cardCode}/payments`,
                body,
                {
                    headers:
                    {
                        'Authorization': `Bearer ${this.AppConfigService.get('QIWI_API_TOKEN')}`
                    }
                })
            return response.data.transaction.id
        }
    }
    async createInvoice(options: EntityData<Invoices>) {
        options.invoiceStatus = this.em.getReference(Offerstatuses, this.AppConfigService.invoiceStatus<string>('waiting').id)
        const invoice = this.em.create(Invoices, options)
        await this.em.persistAndFlush(invoice)
    }
    async getArbState(oldArb: Arbitraries): Promise<boolean> {
        try {
            const arb = await this.em.findOneOrFail(Arbitraries, { id: oldArb.id })
            //check if offer was disputed during timeout 
            if (!(arb.status === ArbitrariesStatus.CLOSEDF && oldArb.status === ArbitrariesStatus.CLOSED)) {
                arb.status = ArbitrariesStatus.CLOSEDF
                await this.em.persistAndFlush(arb)
                return true
            }
            return false
        } catch (error) {
            return false
        }
    }
    async createQiwiTransaction(amount: number, address: string): Promise<string> {
        const body = {
            "id": uuid(),
            "sum": {
                "amount": amount,
                "currency": "643"
            },
            "paymentMethod": {
                "type": "Account",
                "accountId": "643"
            },
            "fields": {
                "account": address
            }
        }
        const response = await axios.post<QIWIresponse>(
            `https://edge.qiwi.com/sinap/api/v2/terms/99/payments`,
            body,
            {
                headers: { 'Authorization': `Bearer ${this.AppConfigService.get('QIWI_API_TOKEN')}` }
            }
        )
        return response.data.transaction.id
    }
}
