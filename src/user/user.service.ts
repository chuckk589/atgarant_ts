import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Users } from 'src/mikroorm/entities/Users';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}
  async findAll() {
    return await this.em.find(Users, {});
  }

  async findOne(id: number) {
    return await this.em.findOne(Users, { id: id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
