import { forwardRef, Module } from '@nestjs/common';
import { BotModule } from 'src/bot/bot.module';
import { offerModule } from 'src/bot/offer-menu/offer.module';
import { PaymentProviderModule } from 'src/payment-provider/payment-provider.module';
import { TelegramModule } from 'src/telegram/telegram.module';
import { AppEventsController } from './app-events.controller';
import { AppEventsService } from './app-events.service';

@Module({
  imports: [offerModule, TelegramModule, PaymentProviderModule.forRootAsync()],
  providers: [AppEventsService, AppEventsController],
  exports: [AppEventsController]
})
export class AppEventsModule { }
