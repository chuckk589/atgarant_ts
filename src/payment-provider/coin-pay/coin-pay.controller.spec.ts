import { Test, TestingModule } from '@nestjs/testing';
import { CoinPayController } from './coin-pay.controller';
import { CoinPayService } from './coin-pay.service';

describe('CoinPayController', () => {
  let controller: CoinPayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoinPayController],
      providers: [CoinPayService],
    }).compile();

    controller = module.get<CoinPayController>(CoinPayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
