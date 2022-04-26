import { Test, TestingModule } from '@nestjs/testing';
import { ArbEditMenuService } from './arb-edit-menu.service';

describe('ArbEditMenuService', () => {
  let service: ArbEditMenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArbEditMenuService],
    }).compile();

    service = module.get<ArbEditMenuService>(ArbEditMenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
