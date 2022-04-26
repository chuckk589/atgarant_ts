import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Users } from './Users';

@Entity()
export class Violations {

  @PrimaryKey()
  id!: number;

  @Property({ length: 512, nullable: true })
  text?: string;

  @Property({ fieldName: 'createdAt' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updatedAt', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne({ entity: () => Users, fieldName: 'userId', onUpdateIntegrity: 'cascade', onDelete: 'cascade', nullable: true, index: 'userId' })
  user?: Users;

}
