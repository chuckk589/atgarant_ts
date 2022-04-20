import { Controller, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PM } from 'src/types/interfaces';

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
        return keys.map(k => new PM(k.split('_').pop(), process.env[k]))
    }
}