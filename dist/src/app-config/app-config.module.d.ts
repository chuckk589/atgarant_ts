import { EntityManager } from '@mikro-orm/core';
import { DynamicModule } from '@nestjs/common';
import { ConfigModuleOptions } from '@nestjs/config';
export declare class AppConfigModule {
    private readonly em;
    constructor(em: EntityManager);
    static forRootAsync(options?: ConfigModuleOptions): DynamicModule;
}
