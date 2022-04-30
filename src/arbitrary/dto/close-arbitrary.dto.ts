import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { ArbModeratorReview } from 'src/types/interfaces';

export class CloseArbDto implements ArbModeratorReview {
    @IsNumber()
    buyerPayout: number;
    @IsNumber()
    sellerPayout: number;
    @IsString()
    comment: string
}
