import { Test, TestingModule } from '@nestjs/testing';
import { OfferEditMenuService } from './offer-edit-menu.service';

describe('OfferEditMenuService', () => {
  let service: OfferEditMenuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OfferEditMenuService],
    }).compile();

    service = module.get<OfferEditMenuService>(OfferEditMenuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
