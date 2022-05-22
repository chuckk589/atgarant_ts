import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/app-config/app-config.service';
import { Paymentmethods } from 'src/mikroorm/entities/Paymentmethods';
import { Users } from 'src/mikroorm/entities/Users';
import { RetirevePmDto } from './dto/retrieve-pm.dto';
import { RetrieveWebAppUser } from './dto/retrieve-user.dto';

@Injectable()
export class WebappService {
  async getUsers(user?: string): Promise<RetrieveWebAppUser[]> {
    const users = await this.em.find(
      Users,
      {
        $or: [{ chatId: { $like: `%${String(user)}%` } }, { username: { $like: `%${String(user)}%` } }],
      },
      {
        populate: ['violations'],
        limit: 6,
      },
    );
    return users.map((user) => new RetrieveWebAppUser(user));
  }
  constructor(private readonly em: EntityManager, private readonly AppConfigService: AppConfigService) {}

  async findConfigs() {
    const pms = await this.em.find(Paymentmethods, {});
    return pms.map((pm) => new RetirevePmDto(pm));
  }
  // create(createWebappDto: CreateWebappDto) {
  //   return 'This action adds a new webapp';
  // }

  findAll() {
    return `This action returns all webapp`;
  }

  findOne(id: number) {
    return `This action returns a #${id} webapp`;
  }

  // update(id: number, updateWebappDto: UpdateWebappDto) {
  //   return `This action updates a #${id} webapp`;
  // }

  remove(id: number) {
    return `This action removes a #${id} webapp`;
  }
}
