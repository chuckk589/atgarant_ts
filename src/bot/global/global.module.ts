import { Module } from "@nestjs/common";
import { globalService } from './global.service'
import { globalComposer } from './global.composer'
import { offerModule } from "../offer/offer.module";
import { AppEventsModule } from "src/app-events/app-events.module";
import { AppEventsService } from "src/app-events/app-events.service";
import { AppEventsController } from "src/app-events/app-events.controller";

@Module({
    imports: [offerModule, AppEventsModule],
    providers: [globalService, globalComposer],
    exports: [globalComposer],
})
export class globalModule { }
