import { BaseMenu, BotContext } from 'src/types/interfaces';
import { Menu as MenuGrammy } from "@grammyjs/menu";
import { AppConfigService } from "src/app-config/app-config.service";
import { AppEventsController } from "src/app-events/app-events.controller";
import { PinoLogger } from 'nestjs-pino';
export declare class OfferEditMenuController extends BaseMenu {
    private readonly AppEventsController;
    private readonly AppConfigService;
    private readonly logger;
    constructor(AppEventsController: AppEventsController, AppConfigService: AppConfigService, logger: PinoLogger);
    menu: MenuGrammy<BotContext>;
}
