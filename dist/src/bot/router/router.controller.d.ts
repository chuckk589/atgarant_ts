import { Router } from '@grammyjs/router';
import { BaseRouter, BotContext } from 'src/types/interfaces';
import { routerService } from './router.service';
import { offerController } from '../offer-menu/offer.controller';
import { AppConfigService } from 'src/app-config/app-config.service';
import { AppEventsController } from '../../app-events/app-events.controller';
import { OfferEditMenuController } from 'src/bot/offer-edit-menu/offer-edit-menu.controller';
import { ArbEditMenuController } from 'src/bot/arb-edit-menu/arb-edit-menu.controller';
import { PinoLogger } from 'nestjs-pino';
export declare class routerController extends BaseRouter {
    private readonly routerService;
    private readonly offerController;
    private readonly OfferEditMenuController;
    private readonly ArbEditMenuController;
    private readonly AppConfigService;
    private readonly AppEventsController;
    private readonly logger;
    constructor(routerService: routerService, offerController: offerController, OfferEditMenuController: OfferEditMenuController, ArbEditMenuController: ArbEditMenuController, AppConfigService: AppConfigService, AppEventsController: AppEventsController, logger: PinoLogger);
    router: Router<BotContext>;
}
