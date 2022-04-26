import { Test, TestingModule } from '@nestjs/testing';
import { ArbEditMenuController } from './arb-edit-menu.controller';
import { ArbEditMenuService } from './arb-edit-menu.service';

describe('ArbEditMenuController', () => {
  let controller: ArbEditMenuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArbEditMenuController],
      providers: [ArbEditMenuService],
    }).compile();

    controller = module.get<ArbEditMenuController>(ArbEditMenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
