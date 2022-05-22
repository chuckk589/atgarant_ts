import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramGateway } from './telegram.gateway';

@Module({
  providers: [TelegramGateway, TelegramService],
  exports: [TelegramGateway],
})
export class TelegramModule {}
