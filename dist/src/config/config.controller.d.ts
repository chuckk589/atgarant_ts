import { ConfigService } from './config.service';
import { UpdateConfigDto } from './dto/update-config.dto';
export declare class ConfigController {
    private readonly configService;
    constructor(configService: ConfigService);
    update(updateConfigDto: UpdateConfigDto): Promise<void>;
    reboot(): never;
    findAll(): Promise<import("@mikro-orm/core").Loaded<import("../mikroorm/entities/Configs").Configs, never>[]>;
}
