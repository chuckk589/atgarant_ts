import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { AppEventsModule } from 'src/app-events/app-events.module';

@Module({
  controllers: [OfferController],
  providers: [OfferService],
  imports: [AppEventsModule]
})
export class OfferModule { }
