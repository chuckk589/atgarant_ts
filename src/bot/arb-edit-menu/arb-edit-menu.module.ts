import { Module } from '@nestjs/common';
import { ArbEditMenuService } from './arb-edit-menu.service';
import { ArbEditMenuController } from './arb-edit-menu.controller';
import { AppEventsModule } from 'src/app-events/app-events.module';
import { offerModule } from '../offer-menu/offer.module';

@Module({
  imports: [offerModule, AppEventsModule],
  providers: [ArbEditMenuService, ArbEditMenuController],
  exports: [ArbEditMenuController],
})
export class ArbEditMenuModule {}
