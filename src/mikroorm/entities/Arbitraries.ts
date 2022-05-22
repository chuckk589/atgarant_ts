import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Offers } from './Offers';
import { Users } from './Users';

@Entity()
export class Arbitraries {
  @PrimaryKey()
  id!: number;

  @Property({ length: 255, nullable: true })
  reason?: string;

  @Property({ length: 255, nullable: true })
  chatId?: string;

  @Property({ length: 512, nullable: true })
  comment?: string;

  @Enum({ items: () => ArbitrariesStatus, nullable: true })
  status?: ArbitrariesStatus;

  @Property({ fieldName: 'buyerPayout', nullable: true, default: 0 })
  buyerPayout?: number = 0;

  @Property({ fieldName: 'sellerPayout', nullable: true, default: 0 })
  sellerPayout?: number = 0;

  @Property({ fieldName: 'createdAt' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updatedAt', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne({
    entity: () => Offers,
    fieldName: 'offerId',
    onUpdateIntegrity: 'cascade',
    onDelete: 'cascade',
    index: 'offerId',
  })
  offer!: Offers;

  @ManyToOne({
    entity: () => Users,
    fieldName: 'initiatorId',
    onUpdateIntegrity: 'cascade',
    onDelete: 'set null',
    nullable: true,
    index: 'initiatorId',
  })
  initiator?: Users;

  @ManyToOne({
    entity: () => Users,
    fieldName: 'arbiterId',
    onUpdateIntegrity: 'cascade',
    onDelete: 'set null',
    nullable: true,
    index: 'arbiterId',
  })
  arbiter?: Users;
}

export enum ArbitrariesStatus {
  ACTIVE = 'active',
  DISPUTED = 'disputed',
  CLOSED = 'closed',
  CLOSEDF = 'closedF',
}
