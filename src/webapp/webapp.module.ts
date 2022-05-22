import { Module } from '@nestjs/common';
import { WebappService } from './webapp.service';
import { WebappController } from './webapp.controller';

@Module({
  controllers: [WebappController],
  providers: [WebappService],
})
export class WebappModule {}
