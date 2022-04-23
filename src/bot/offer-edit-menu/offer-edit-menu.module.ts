import { Module } from '@nestjs/common';
import { OfferEditMenuService } from './offer-edit-menu.service';
import { OfferEditMenuController } from './offer-edit-menu.controller';

@Module({
  controllers: [OfferEditMenuController],
  providers: [OfferEditMenuService]
})
export class OfferEditMenuModule {}
