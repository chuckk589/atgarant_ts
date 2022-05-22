import { Module } from '@nestjs/common';
import { AppEventsController } from 'src/app-events/app-events.controller';
import { AppEventsModule } from 'src/app-events/app-events.module';
import { ArbEditMenuModule } from '../arb-edit-menu/arb-edit-menu.module';
import { BotModule } from '../bot.module';
import { OfferEditMenuModule } from '../offer-edit-menu/offer-edit-menu.module';
import { offerController } from '../offer-menu/offer.controller';
import { offerModule } from '../offer-menu/offer.module';
import { offerService } from '../offer-menu/offer.service';
import { routerController } from './router.controller';
import { routerService } from './router.service';

@Module({
  imports: [offerModule, OfferEditMenuModule, ArbEditMenuModule, AppEventsModule],
  providers: [routerService, routerController],
  exports: [routerController],
})
export class routerModule {}
