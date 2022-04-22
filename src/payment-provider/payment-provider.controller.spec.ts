import { Test, TestingModule } from '@nestjs/testing';
import { PaymentProviderController } from './payment-provider.controller';
import { PaymentProviderService } from './payment-provider.service';

describe('PaymentProviderController', () => {
  let controller: PaymentProviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentProviderController],
      providers: [PaymentProviderService],
    }).compile();

    controller = module.get<PaymentProviderController>(PaymentProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
