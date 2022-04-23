import { Test, TestingModule } from '@nestjs/testing';
import { CoinPayService } from './coin-pay.service';

describe('CoinPayService', () => {
  let service: CoinPayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoinPayService],
    }).compile();

    service = module.get<CoinPayService>(CoinPayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
