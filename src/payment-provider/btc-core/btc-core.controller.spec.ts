import { Test, TestingModule } from '@nestjs/testing';
import { BtcCoreController } from './btc-core.controller';
import { BtcCoreService } from './btc-core.service';

describe('BtcCoreController', () => {
  let controller: BtcCoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BtcCoreController],
      providers: [BtcCoreService],
    }).compile();

    controller = module.get<BtcCoreController>(BtcCoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
