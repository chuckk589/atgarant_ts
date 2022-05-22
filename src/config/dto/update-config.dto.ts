import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateConfigDto {
  @IsNotEmpty()
  id: number | string;
  @IsString()
  value: string;
  @IsString()
  name: string;
}
