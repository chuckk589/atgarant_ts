import { Module } from "@nestjs/common";
import { AppEventsController } from "src/app-events/app-events.controller";
import { AppEventsModule } from "src/app-events/app-events.module";
import { BotModule } from "../bot.module";
import { offerController } from "../offer/offer.controller";
import { offerModule } from "../offer/offer.module";
import { offerService } from "../offer/offer.service";
import { routerController } from "./router.controller";
import { routerService } from "./router.service";


@Module({
    imports: [offerModule, AppEventsModule],
    providers: [routerService, routerController],
    exports: [routerController]
})
export class routerModule { }
