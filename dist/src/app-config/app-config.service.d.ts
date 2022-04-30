import { ConfigService } from '@nestjs/config';
import { CommonConfig, PM } from 'src/types/interfaces';
export declare class AppConfigService {
    private readonly configService;
    constructor(configService: ConfigService);
    get<T>(key: string, options?: any): (string extends keyof T ? string extends import("@nestjs/config").Path<T[keyof T & string]> ? import("@nestjs/config").PathValue<T[keyof T & string], import("@nestjs/config").Path<T[keyof T & string]> & string> : never : never) | (any extends keyof T ? T[any] : never);
    get payments(): PM[];
    offerStatus<T = string | number>(idOrValue: T): CommonConfig;
    invoiceStatus<T = string | number>(idOrValue: T): CommonConfig;
}
