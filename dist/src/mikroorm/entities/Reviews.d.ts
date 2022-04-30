import { Offers } from './Offers';
import { Users } from './Users';
export declare class Reviews {
    id: number;
    text?: string;
    rate?: ReviewsRate;
    createdAt: Date;
    updatedAt: Date;
    offer?: Offers;
    recipient?: Users;
    author?: Users;
}
export declare enum ReviewsRate {
    POSITIVE = "positive",
    NEGATIVE = "negative"
}
