import { forwardRef, Module } from '@nestjs/common';
import { BotModule } from 'src/bot/bot.module';
import { offerModule } from 'src/bot/offer/offer.module';
import { AppEventsController } from './app-events.controller';
import { AppEventsService } from './app-events.service';

@Module({
  imports: [offerModule],
  providers: [AppEventsService, AppEventsController],
  exports: [AppEventsController]
})
export class AppEventsModule { }
