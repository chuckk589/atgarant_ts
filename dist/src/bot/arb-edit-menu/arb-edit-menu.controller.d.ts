import { BaseMenu, BotContext } from 'src/types/interfaces';
import { Menu as MenuGrammy } from "@grammyjs/menu";
import { AppEventsController } from "src/app-events/app-events.controller";
import { PinoLogger } from 'nestjs-pino';
export declare class ArbEditMenuController extends BaseMenu {
    private readonly AppEventsController;
    private readonly logger;
    constructor(AppEventsController: AppEventsController, logger: PinoLogger);
    menu: MenuGrammy<BotContext>;
}
