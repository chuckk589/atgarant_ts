import { Test, TestingModule } from '@nestjs/testing';
import { ArbitraryController } from './arbitrary.controller';
import { ArbitraryService } from './arbitrary.service';

describe('ArbitraryController', () => {
  let controller: ArbitraryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArbitraryController],
      providers: [ArbitraryService],
    }).compile();

    controller = module.get<ArbitraryController>(ArbitraryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
