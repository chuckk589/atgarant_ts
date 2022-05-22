import { Module } from '@nestjs/common';
import { ArbitraryService } from './arbitrary.service';
import { ArbitraryController } from './arbitrary.controller';
import { TelegramModule } from 'src/telegram/telegram.module';
import { AppEventsModule } from 'src/app-events/app-events.module';

@Module({
  controllers: [ArbitraryController],
  providers: [ArbitraryService],
  imports: [TelegramModule, AppEventsModule],
})
export class ArbitraryModule {}
