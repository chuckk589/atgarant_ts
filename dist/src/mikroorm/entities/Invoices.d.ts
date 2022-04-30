import { Invoicestatuses } from './Invoicestatuses';
import { Offers } from './Offers';
export declare class Invoices {
    id: number;
    type?: InvoicesType;
    currency?: string;
    value?: number;
    fee?: number;
    txnId?: string;
    url?: string;
    createdAt: Date;
    updatedAt: Date;
    offer: Offers;
    invoiceStatus: Invoicestatuses;
}
export declare enum InvoicesType {
    IN = "in",
    OUT = "out",
    REFUND = "refund"
}
