import { Router } from "@grammyjs/router";
import { BaseRouter, BotContext } from "src/types/interfaces";
import { routerService } from './router.service';
import { offerController } from '../offer-menu/offer.controller';
import { AppConfigService } from "src/app-config/app-config.service";
import { AppEventsController } from "../../app-events/app-events.controller";
import { OfferEditMenuController } from 'src/bot/offer-edit-menu/offer-edit-menu.controller';
export declare class routerController extends BaseRouter {
    private readonly routerService;
    private readonly offerController;
    private readonly OfferEditMenuController;
    private readonly AppConfigService;
    private readonly AppEventsController;
    constructor(routerService: routerService, offerController: offerController, OfferEditMenuController: OfferEditMenuController, AppConfigService: AppConfigService, AppEventsController: AppEventsController);
    router: Router<BotContext>;
}
