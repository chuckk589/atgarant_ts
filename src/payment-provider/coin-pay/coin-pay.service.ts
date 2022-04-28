import { EntityData, EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Invoices, InvoicesType } from 'src/mikroorm/entities/Invoices';
import { uuid } from 'uuidv4';
import { AppConfigService } from 'src/app-config/app-config.service'
import axios from 'axios';
import { Arbitraries, ArbitrariesStatus } from 'src/mikroorm/entities/Arbitraries';


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
        options.invoiceStatus = { value: 'waiting' }
        await this.em.nativeInsert(Invoices, options)
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
