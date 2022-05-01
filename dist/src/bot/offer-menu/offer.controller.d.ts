import { Menu as MenuGrammy } from "@grammyjs/menu";
import { AppConfigService } from "src/app-config/app-config.service";
import { BaseMenu, BotContext } from "src/types/interfaces";
import { offerService } from './offer.service';
export declare class offerController extends BaseMenu {
    private readonly offerService;
    private readonly configService;
    constructor(offerService: offerService, configService: AppConfigService);
    menu: MenuGrammy<BotContext>;
}
