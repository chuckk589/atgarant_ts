import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Users } from './Users';

@Entity()
export class
  Profiles {

  @PrimaryKey()
  id!: number;

  @Property({ fieldName: 'offersAsBuyer', nullable: true, default: 0 })
  offersAsBuyer?: number = 0;

  @Property({ fieldName: 'totalOfferValueRub', nullable: true, default: 0 })
  totalOfferValueRub?: number = 0;

  @Property({ fieldName: 'offersAsSeller', nullable: true, default: 0 })
  offersAsSeller?: number = 0;

  @Property({ fieldName: 'arbitrariesTotal', nullable: true, default: 0 })
  arbitrariesTotal?: number = 0;

  @Property({ fieldName: 'feedbackPositive', nullable: true, default: 0 })
  feedbackPositive?: number = 0;

  @Property({ fieldName: 'feedbackNegative', nullable: true, default: 0 })
  feedbackNegative?: number = 0;

  @Property({ nullable: true, default: 0 })
  violations?: number = 0;

  @Property({ fieldName: 'createdAt' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updatedAt', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  // @ManyToOne({ entity: () => Users, fieldName: 'userId', onUpdateIntegrity: 'cascade', onDelete: 'cascade', nullable: true, index: 'userId' })
  // userId?: Users;
  @OneToOne({ entity: () => Users, inversedBy: 'profile', fieldName: 'userId', index: 'userId' })
  user!: Users;

}
