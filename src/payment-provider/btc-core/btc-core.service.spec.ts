import { Test, TestingModule } from '@nestjs/testing';
import { BtcCoreService } from './btc-core.service';

describe('BtcCoreService', () => {
  let service: BtcCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BtcCoreService],
    }).compile();

    service = module.get<BtcCoreService>(BtcCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
