import { Test, TestingModule } from '@nestjs/testing';
import { AppEventsController } from './app-events.controller';

describe('AppEventsController', () => {
  let controller: AppEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppEventsController],
    }).compile();

    controller = module.get<AppEventsController>(AppEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
