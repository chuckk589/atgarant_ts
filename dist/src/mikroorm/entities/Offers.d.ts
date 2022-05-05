import { Collection, EventArgs } from '@mikro-orm/core';
import { Invoices } from './Invoices';
import { Offerstatuses } from './Offerstatuses';
import { Paymentmethods } from './Paymentmethods';
import { Reviews } from './Reviews';
import { Users } from './Users';
export declare class Offers {
    constructor(payload?: any);
    id: number;
    role?: OffersRole;
    feePayer?: OffersFeePayer;
    offerValue: number;
    feeBaked?: number;
    estimatedShipping?: Date;
    productDetails?: string;
    shippingDetails?: string;
    productAdditionalDetails?: string;
    restDetails?: string;
    refundDetails?: string;
    sellerWalletData?: string;
    buyerWalletData?: string;
    createdAt: Date;
    updatedAt: Date;
    offerStatus: Offerstatuses;
    partner?: Users;
    initiator?: Users;
    paymentMethod: Paymentmethods;
    invoices: Collection<Invoices, unknown>;
    reviews: Collection<Reviews, unknown>;
    afterCreate(args: EventArgs<Offers>): Promise<void>;
}
export declare enum OffersRole {
    BUYER = "buyer",
    SELLER = "seller"
}
export declare enum OffersFeePayer {
    BUYER = "buyer",
    SELLER = "seller"
}
