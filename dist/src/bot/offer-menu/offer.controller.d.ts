import { Menu as MenuGrammy } from "@grammyjs/menu";
import { AppConfigService } from "src/app-config/app-config.service";
import { BaseMenu, BotContext } from "src/types/interfaces";
import { offerService } from './offer.service';
export declare class offerController extends BaseMenu {
    private readonly offerService;
    private readonly AppConfigService;
    constructor(offerService: offerService, AppConfigService: AppConfigService);
    menu: MenuGrammy<BotContext>;
}
