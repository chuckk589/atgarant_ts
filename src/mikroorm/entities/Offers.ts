import {
  AfterCreate,
  Collection,
  Entity,
  Enum,
  EventArgs,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Invoices } from './Invoices';
import { Offerstatuses } from './Offerstatuses';
import { Paymentmethods } from './Paymentmethods';
import { Profiles } from './Profiles';
import { Reviews } from './Reviews';
import { Users } from './Users';

@Entity()
export class Offers {
  constructor(payload?: any) {
    Object.assign(this, payload);
  }
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

  @Property({ fieldName: 'estimatedShipping', nullable: true })
  estimatedShipping?: Date;

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
  createdAt: Date = new Date();

  @Property({ fieldName: 'updatedAt', onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @ManyToOne({
    entity: () => Offerstatuses,
    fieldName: 'offerStatusId',
    onUpdateIntegrity: 'cascade',
    index: 'offerStatusId',
  })
  offerStatus!: Offerstatuses;

  @ManyToOne({
    entity: () => Users,
    fieldName: 'partnerId',
    onUpdateIntegrity: 'cascade',
    onDelete: 'set null',
    nullable: true,
    index: 'partnerId',
  })
  partner?: Users;

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
    entity: () => Paymentmethods,
    fieldName: 'paymentMethodId',
    onUpdateIntegrity: 'cascade',
    index: 'paymentMethodId',
  })
  paymentMethod!: Paymentmethods;

  @OneToMany(() => Invoices, (invoice) => invoice.offer)
  invoices = new Collection<Invoices>(this);

  @OneToMany(() => Reviews, (review) => review.offer)
  reviews = new Collection<Reviews>(this);

  @AfterCreate()
  async afterCreate(args: EventArgs<Offers>): Promise<void> {
    const seller = args.entity.role === 'seller' ? 'initiator' : 'partner';
    const buyer = args.entity.role === 'buyer' ? 'initiator' : 'partner';
    args.em
      .getConnection()
      .execute(
        `UPDATE profiles SET offersAsBuyer = offersAsBuyer + 1, totalOfferValueRub = totalOfferValueRub + ${this.offerValue} WHERE userId = ${this[buyer].id}`,
      );
    args.em
      .getConnection()
      .execute(
        `UPDATE profiles SET offersAsSeller = offersAsSeller + 1, totalOfferValueRub = totalOfferValueRub + ${this.offerValue} WHERE userId = ${this[seller].id}`,
      );
  }
}

export enum OffersRole {
  BUYER = 'buyer',
  SELLER = 'seller',
}

export enum OffersFeePayer {
  BUYER = 'buyer',
  SELLER = 'seller',
}
