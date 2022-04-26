import { Module } from '@nestjs/common';
import { OfferEditMenuService } from './offer-edit-menu.service';
import { OfferEditMenuController } from './offer-edit-menu.controller';
import { AppEventsModule } from "src/app-events/app-events.module"
import { offerModule } from '../offer-menu/offer.module';

@Module({
  imports: [offerModule, AppEventsModule], // not working without offermodule import // ?????
  providers: [OfferEditMenuService, OfferEditMenuController],
  exports: [OfferEditMenuController],
})
export class OfferEditMenuModule { }
