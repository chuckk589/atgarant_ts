import {  IsNumber, IsString } from 'class-validator';

export class CreateArbDto {
    @IsString()
    reason: string;
    @IsNumber()
    initiator: number;
}