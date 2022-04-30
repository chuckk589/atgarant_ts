import { Users } from './Users';
export declare class Profiles {
    id: number;
    offersAsBuyer?: number;
    totalOfferValueRub?: number;
    offersAsSeller?: number;
    arbitrariesTotal?: number;
    feedbackPositive?: number;
    feedbackNegative?: number;
    violations?: number;
    createdAt: Date;
    updatedAt: Date;
    user: Users;
}
