import { Controller, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommonConfig, PM } from 'src/types/interfaces';

@Injectable()
export class AppConfigService {
    constructor(
        private readonly configService: ConfigService
    ) { }
    get<T>(key: string, options?: any) {
        return this.configService.get<T>(key, options)
    }
    get payments(): PM[] {
        const keys = Object.keys(process.env).filter(k => k.includes('paymentMethod'))
        const operationMode = this.get('PAYMENT_SERVICE')
        return operationMode == 'btc-core' ? keys.map(k => new PM(k.split('_').pop(), process.env[k])).filter(p => p.method == 'BTC') : keys.map(k => new PM(k.split('_').pop(), process.env[k]))
    }
    offerStatus<T = string | number>(idOrValue: T): CommonConfig {
        const statuses = Object.keys(process.env)
            .filter(k => k.includes('offerStatus'))
            .map(k => new CommonConfig(k.split('_').pop(), process.env[k]))
        return typeof idOrValue == 'number' ? statuses.find(s => s.id === idOrValue) : statuses.find(s => s.value === String(idOrValue) || s.name === String(idOrValue))
    }
    invoiceStatus<T = string | number>(idOrValue: T): CommonConfig {
        const statuses = Object.keys(process.env)
            .filter(k => k.includes('invoiceStatus'))
            .map(k => new CommonConfig(k.split('_').pop(), process.env[k]))
        return typeof idOrValue == 'number' ? statuses.find(s => s.id === idOrValue) : statuses.find(s => s.value === String(idOrValue))
    }
}