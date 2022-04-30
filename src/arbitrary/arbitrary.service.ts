import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Arbitraries } from 'src/mikroorm/entities/Arbitraries';
import { TelegramGateway } from 'src/telegram/telegram.gateway';
import { AppEventsController } from 'src/app-events/app-events.controller'
import { CloseArbDto } from './dto/close-arbitrary.dto';
import { DisputeArbDto } from './dto/dispute-arbitrary.dto';

@Injectable()
export class ArbitraryService {
  constructor(
    private readonly em: EntityManager,
    private readonly telegramGateway: TelegramGateway,
    private readonly AppEventsController: AppEventsController
  ) { }
  async disputeArb(id: string, DisputeArbDto: DisputeArbDto) {
    return await this.AppEventsController.arbDisputed(id, DisputeArbDto.chatId)
  }
  async closeArb(id: string, arbData: CloseArbDto) {
    return await this.AppEventsController.arbClosed(id, arbData)
  }
  async getHistory(id: string) {
    return await this.telegramGateway.getChatHistory(Number(id))
  }
  async findAll(userId?: string) {
    const options = userId
      ? {
        offer: {
          $or: [
            { partner: { id: Number(userId) } },
            { initiator: { id: Number(userId) } }
          ]
        }
      }
      : {}
    return await this.em.find(Arbitraries, options, { populate: ['offer.initiator', 'offer.partner'] })
  }

}
