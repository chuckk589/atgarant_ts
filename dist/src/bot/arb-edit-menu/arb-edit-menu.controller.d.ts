import { BaseMenu, BotContext } from 'src/types/interfaces';
import { Menu as MenuGrammy } from "@grammyjs/menu";
import { AppEventsController } from "src/app-events/app-events.controller";
export declare class ArbEditMenuController extends BaseMenu {
    private readonly AppEventsController;
    constructor(AppEventsController: AppEventsController);
    menu: MenuGrammy<BotContext>;
}
