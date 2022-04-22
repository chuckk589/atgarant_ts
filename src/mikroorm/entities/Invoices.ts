import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Invoicestatuses } from './Invoicestatuses';
import { Offers } from './Offers';

@Entity()
export class Invoices {

  @PrimaryKey()
  id!: number;

  @Enum({ items: () => InvoicesType, nullable: true })
  type?: InvoicesType;

  @Property({ length: 255, nullable: true })
  currency?: string;

  @Property({ columnType: 'float', nullable: true })
  value?: number;

  @Property({ columnType: 'float', nullable: true })
  fee?: number;

  @Property({ length: 255, nullable: true })
  txnId?: string;

  @Property({ length: 255, nullable: true })
  url?: string;

  @Property({ fieldName: 'createdAt' })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updatedAt', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne({ entity: () => Offers, fieldName: 'offerId', onUpdateIntegrity: 'cascade', onDelete: 'cascade', index: 'offerId' })
  offer!: Offers;

  @ManyToOne({ entity: () => Invoicestatuses, fieldName: 'invoiceStatusId', onUpdateIntegrity: 'cascade', index: 'invoiceStatusId' })
  invoiceStatus!: Invoicestatuses;

}

export enum InvoicesType {
  IN = 'in',
  OUT = 'out',
  REFUND = 'refund',
}
