import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Users } from '../entities/Users';

export class DevSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    em.create(Users, {
      chatId: '5177177451',
      role: 1,
    });
    em.create(Users, {
      chatId: '1993835727',
      role: 2,
    });
  }
}
