import { Module } from "@nestjs/common";
import { globalService } from './global.service'
import { globalComposer } from './global.composer'
import { offerModule } from "../offer-menu/offer.module";
import { AppEventsModule } from "src/app-events/app-events.module";
import { AppEventsService } from "src/app-events/app-events.service";
import { AppEventsController } from "src/app-events/app-events.controller";
import { PaymentProviderModule } from "src/payment-provider/payment-provider.module";
import { OfferEditMenuModule } from "../offer-edit-menu/offer-edit-menu.module";
import { ArbEditMenuModule } from "../arb-edit-menu/arb-edit-menu.module";

@Module({
    imports: [
        offerModule,
        OfferEditMenuModule,
        ArbEditMenuModule,
        AppEventsModule,
        PaymentProviderModule.forRootAsync()
    ],
    providers: [globalService, globalComposer],
    exports: [globalComposer],
})
export class globalModule { }
