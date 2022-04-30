import { Offers } from './Offers';
import { Users } from './Users';
export declare class Arbitraries {
    id: number;
    reason?: string;
    chatId?: string;
    comment?: string;
    status?: ArbitrariesStatus;
    buyerPayout?: number;
    sellerPayout?: number;
    createdAt: Date;
    updatedAt: Date;
    offer: Offers;
    initiator?: Users;
    arbiter?: Users;
}
export declare enum ArbitrariesStatus {
    ACTIVE = "active",
    DISPUTED = "disputed",
    CLOSED = "closed",
    CLOSEDF = "closedF"
}
