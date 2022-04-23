import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Invoices } from 'src/mikroorm/entities/Invoices';
import { Offerstatuses } from 'src/mikroorm/entities/Offerstatuses';
import { AppConfigService } from 'src/app-config/app-config.service'



@Injectable()
export class PaymentsService {
    constructor(
        private readonly em: EntityManager,
        private readonly AppConfigService: AppConfigService,
        
    ) { }
    async registerPayment(txn_id: string) {
        const status = this.AppConfigService.invoiceStatus<string>('success')
        await this.em.nativeUpdate(Invoices, { txnId: txn_id }, {
            invoiceStatus: this.em.getReference(Offerstatuses, status.id)
        })
    }
}
