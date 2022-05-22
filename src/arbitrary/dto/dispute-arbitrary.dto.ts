import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { ArbModeratorReview } from 'src/types/interfaces';

export class DisputeArbDto {
  @IsString()
  chatId: number;
}
