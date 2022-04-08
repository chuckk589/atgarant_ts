import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Users {

  @PrimaryKey()
  id!: number;

  @Unique({ name: 'chat_id' })
  @Property({ length: 255, nullable: true })
  chatId?: string;

  @Unique({ name: 'username' })
  @Property({ length: 255, nullable: true })
  username?: string;

  @Property({ length: 255, nullable: true })
  firstName?: string;

  @Property({ length: 255, nullable: true })
  password?: string;

  @Property({ length: 255, nullable: true, default: 'ru' })
  locale?: string;

  @Property({ nullable: true, default: 0 })
  role?: number = 0;

  @Property({ fieldName: 'acceptedRules', nullable: true, default: 0 })
  acceptedRules?: number = 0;

  @Property({ fieldName: 'createdAt' })
  createdAt!: Date;

  @Property({ fieldName: 'updatedAt' })
  updatedAt!: Date;

}
