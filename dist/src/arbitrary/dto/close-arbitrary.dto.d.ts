import { ArbModeratorReview } from 'src/types/interfaces';
export declare class CloseArbDto implements ArbModeratorReview {
    buyerPayout: number;
    sellerPayout: number;
    comment: string;
}
