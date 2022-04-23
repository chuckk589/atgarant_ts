import { Test, TestingModule } from '@nestjs/testing';
import { OfferEditMenuController } from './offer-edit-menu.controller';
import { OfferEditMenuService } from './offer-edit-menu.service';

describe('OfferEditMenuController', () => {
  let controller: OfferEditMenuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferEditMenuController],
      providers: [OfferEditMenuService],
    }).compile();

    controller = module.get<OfferEditMenuController>(OfferEditMenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
