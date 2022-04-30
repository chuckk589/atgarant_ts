import { EntityManager } from '@mikro-orm/core';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Configs } from 'src/mikroorm/entities/Configs';
import { UpdateConfigDto } from './dto/update-config.dto';
export declare class ConfigService {
    private readonly em;
    private readonly AppConfigService;
    constructor(em: EntityManager, AppConfigService: AppConfigService);
    update(body: UpdateConfigDto): Promise<void>;
    findAll(): Promise<import("@mikro-orm/core").Loaded<Configs, never>[]>;
}
