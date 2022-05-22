import { WebappService } from './webapp.service';
import { RetrieveWebAppUser } from './dto/retrieve-user.dto';
export declare class WebappController {
    private readonly webappService;
    constructor(webappService: WebappService);
    findConfigs(): Promise<import("./dto/retrieve-pm.dto").RetirevePmDto[]>;
    getUsers(user?: string): Promise<RetrieveWebAppUser[]>;
    findAll(): string;
    findOne(id: string): string;
    remove(id: string): string;
}
