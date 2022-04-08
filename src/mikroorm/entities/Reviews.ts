import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Offers } from './Offers';
import { Users } from './Users';

@Entity()
export class Reviews {

  @PrimaryKey()
  id!: number;

  @Property({ length: 512, nullable: true })
  text?: string;

  @Enum({ items: () => ReviewsRate, nullable: true })
  rate?: ReviewsRate;

  @Property({ fieldName: 'createdAt' })
  createdAt!: Date;

  @Property({ fieldName: 'updatedAt' })
  updatedAt!: Date;

  @ManyToOne({ entity: () => Offers, fieldName: 'offerId', onUpdateIntegrity: 'cascade', onDelete: 'set null', nullable: true, index: 'offerId' })
  offerId?: Offers;

  @ManyToOne({ entity: () => Users, fieldName: 'recipientId', onUpdateIntegrity: 'cascade', onDelete: 'set null', nullable: true, index: 'recipientId' })
  recipientId?: Users;

  @ManyToOne({ entity: () => Users, fieldName: 'authorId', onUpdateIntegrity: 'cascade', onDelete: 'set null', nullable: true, index: 'authorId' })
  authorId?: Users;

}

export enum ReviewsRate {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}
