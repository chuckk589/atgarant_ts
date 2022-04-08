import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Users } from './Users';

@Entity()
export class Links {

  @PrimaryKey()
  id!: number;

  @Property({ length: 255, nullable: true })
  url?: string;

  @Property({ fieldName: 'createdAt' })
  createdAt!: Date;

  @Property({ fieldName: 'updatedAt' })
  updatedAt!: Date;

  @ManyToOne({ entity: () => Users, fieldName: 'userId', onUpdateIntegrity: 'cascade', onDelete: 'set null', nullable: true, index: 'userId' })
  userId?: Users;

}
