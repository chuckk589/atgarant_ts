import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ArbModeratorReview } from 'src/types/interfaces';

export class CloseArbDto implements ArbModeratorReview {
  @IsNumber()
  @IsOptional()
  buyerPayout: number;
  @IsNumber()
  @IsOptional()
  sellerPayout: number;
  @IsString()
  comment: string;
}
