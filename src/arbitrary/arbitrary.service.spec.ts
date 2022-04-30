import { Test, TestingModule } from '@nestjs/testing';
import { ArbitraryService } from './arbitrary.service';

describe('ArbitraryService', () => {
  let service: ArbitraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArbitraryService],
    }).compile();

    service = module.get<ArbitraryService>(ArbitraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
