import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Offerstatuses } from './Offerstatuses';
import { Paymentmethods } from './Paymentmethods';
import { Users } from './Users';

@Entity()
export class Offers {

  @PrimaryKey()
  id!: number;

  @Enum({ items: () => OffersRole, nullable: true })
  role?: OffersRole;

  @Enum({ fieldName: 'feePayer', items: () => OffersFeePayer, nullable: true })
  feePayer?: OffersFeePayer;

  @Property({ fieldName: 'offerValue' })
  offerValue!: number;

  @Property({ fieldName: 'feeBaked', nullable: true })
  feeBaked?: number;

  @Property({ fieldName: 'estimatedShipping', columnType: 'date', nullable: true })
  estimatedShipping?: string;

  @Property({ fieldName: 'productDetails', length: 255, nullable: true })
  productDetails?: string;

  @Property({ fieldName: 'shippingDetails', length: 255, nullable: true })
  shippingDetails?: string;

  @Property({ fieldName: 'productAdditionalDetails', length: 255, nullable: true })
  productAdditionalDetails?: string;

  @Property({ fieldName: 'restDetails', length: 255, nullable: true })
  restDetails?: string;

  @Property({ fieldName: 'refundDetails', length: 255, nullable: true })
  refundDetails?: string;

  @Property({ fieldName: 'sellerWalletData', length: 255, nullable: true })
  sellerWalletData?: string;

  @Property({ fieldName: 'buyerWalletData', length: 255, nullable: true })
  buyerWalletData?: string;

  @Property({ fieldName: 'createdAt' })
  createdAt!: Date;

  @Property({ fieldName: 'updatedAt' })
  updatedAt!: Date;

  @ManyToOne({ entity: () => Offerstatuses, fieldName: 'offerStatusId', onUpdateIntegrity: 'cascade', index: 'offerStatusId' })
  offerStatusId!: Offerstatuses;

  @ManyToOne({ entity: () => Users, fieldName: 'partnerId', onUpdateIntegrity: 'cascade', onDelete: 'set null', nullable: true, index: 'partnerId' })
  partnerId?: Users;

  @ManyToOne({ entity: () => Users, fieldName: 'initiatorId', onUpdateIntegrity: 'cascade', onDelete: 'set null', nullable: true, index: 'initiatorId' })
  initiatorId?: Users;

  @ManyToOne({ entity: () => Paymentmethods, fieldName: 'paymentMethodId', onUpdateIntegrity: 'cascade', index: 'paymentMethodId' })
  paymentMethodId!: Paymentmethods;

}

export enum OffersRole {
  BUYER = 'buyer',
  SELLER = 'seller',
}

export enum OffersFeePayer {
  BUYER = 'buyer',
  SELLER = 'seller',
}
