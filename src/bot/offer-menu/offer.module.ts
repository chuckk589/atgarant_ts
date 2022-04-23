import { Module } from "@nestjs/common";
import { AppEventsController } from "src/app-events/app-events.controller";
import { AppEventsModule } from "src/app-events/app-events.module";
import { offerController } from './offer.controller'
import { offerService } from "./offer.service";

@Module({
    imports: [],
    providers: [offerController, offerService],
    exports: [offerController]
})
export class offerModule { }
