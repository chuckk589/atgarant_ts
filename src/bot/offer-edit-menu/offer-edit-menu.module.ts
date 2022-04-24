import { Module } from '@nestjs/common';
import { OfferEditMenuService } from './offer-edit-menu.service';
import { OfferEditMenuController } from './offer-edit-menu.controller';

@Module({
  providers: [OfferEditMenuService, OfferEditMenuController],
  exports: [OfferEditMenuController],
})
export class OfferEditMenuModule { }
