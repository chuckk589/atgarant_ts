import { OfferService } from './offer.service';
import { CreateArbDto } from './dto/create-arb.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
export declare class OfferController {
    private readonly offerService;
    constructor(offerService: OfferService);
    findAll(userId: string): Promise<import("@mikro-orm/core").Loaded<import("../mikroorm/entities/Offers").Offers, "paymentMethod" | "initiator" | "partner" | "offerStatus" | "reviews">[]>;
    close(id: string): Promise<import("../mikroorm/entities/Offerstatuses").Offerstatuses>;
    arbitrary(id: string, CreateArbDto: CreateArbDto): Promise<import("../mikroorm/entities/Offerstatuses").Offerstatuses>;
    update(id: string, updateOfferDto: UpdateOfferDto): Promise<number>;
}
