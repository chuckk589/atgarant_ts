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
  createdAt: Date = new Date();

  @Property({ fieldName: 'updatedAt', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne({
    entity: () => Offers,
    fieldName: 'offerId',
    onUpdateIntegrity: 'cascade',
    onDelete: 'set null',
    nullable: true,
    index: 'offerId',
  })
  offer?: Offers;

  @ManyToOne({
    entity: () => Users,
    fieldName: 'recipientId',
    onUpdateIntegrity: 'cascade',
    onDelete: 'set null',
    nullable: true,
    index: 'recipientId',
  })
  recipient?: Users;

  @ManyToOne({
    entity: () => Users,
    fieldName: 'authorId',
    onUpdateIntegrity: 'cascade',
    onDelete: 'set null',
    nullable: true,
    index: 'authorId',
  })
  author?: Users;
}

export enum ReviewsRate {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
}
