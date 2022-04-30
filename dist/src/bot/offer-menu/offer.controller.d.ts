import { AppConfigService } from "src/app-config/app-config.service";
import { BaseMenu, BotContext } from "src/types/interfaces";
import { offerService } from './offer.service';
import { Menu as ExMenu } from 'src/bot/plugins/menu/menu-extended';
export declare class offerController extends BaseMenu {
    private readonly offerService;
    private readonly configService;
    constructor(offerService: offerService, configService: AppConfigService);
    menu: ExMenu<BotContext>;
}
