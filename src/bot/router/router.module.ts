import { Module } from "@nestjs/common";
import { AppEventsController } from "src/app-events/app-events.controller";
import { AppEventsModule } from "src/app-events/app-events.module";
import { BotModule } from "../bot.module";
import { offerController } from "../offer-menu/offer.controller";
import { offerModule } from "../offer-menu/offer.module";
import { offerService } from "../offer-menu/offer.service";
import { routerController } from "./router.controller";
import { routerService } from "./router.service";


@Module({
    imports: [offerModule, AppEventsModule],
    providers: [routerService, routerController],
    exports: [routerController]
})
export class routerModule { }
