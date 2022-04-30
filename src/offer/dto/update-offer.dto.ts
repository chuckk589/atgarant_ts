import { IsBoolean, IsNumber, IsString } from 'class-validator';


export class UpdateOfferDto {
    @IsString()
    walletData: string
    @IsBoolean()
    seller: boolean
}
