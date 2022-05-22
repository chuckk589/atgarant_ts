import { EntityManager } from '@mikro-orm/core';
import { AppConfigService } from 'src/app-config/app-config.service';
import { RetirevePmDto } from './dto/retrieve-pm.dto';
import { RetrieveWebAppUser } from './dto/retrieve-user.dto';
export declare class WebappService {
    private readonly em;
    private readonly AppConfigService;
    getUsers(user?: string): Promise<RetrieveWebAppUser[]>;
    constructor(em: EntityManager, AppConfigService: AppConfigService);
    findConfigs(): Promise<RetirevePmDto[]>;
    findAll(): string;
    findOne(id: number): string;
    remove(id: number): string;
}
