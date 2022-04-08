import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Users } from './Users';

@Entity()
export class Violations {

  @PrimaryKey()
  id!: number;

  @Property({ length: 512, nullable: true })
  text?: string;

  @Property({ fieldName: 'createdAt' })
  createdAt!: Date;

  @Property({ fieldName: 'updatedAt' })
  updatedAt!: Date;

  @ManyToOne({ entity: () => Users, fieldName: 'userId', onUpdateIntegrity: 'cascade', onDelete: 'cascade', nullable: true, index: 'userId' })
  userId?: Users;

}
