import { Test, TestingModule } from '@nestjs/testing';
import { TelegramGateway } from './telegram.gateway';
import { TelegramService } from './telegram.service';

describe('TelegramGateway', () => {
  let gateway: TelegramGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelegramGateway, TelegramService],
    }).compile();

    gateway = module.get<TelegramGateway>(TelegramGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
