import { ArbitraryService } from './arbitrary.service';
import { CloseArbDto } from './dto/close-arbitrary.dto';
import { DisputeArbDto } from './dto/dispute-arbitrary.dto';
import { ArbitrariesStatus } from 'src/mikroorm/entities/Arbitraries';
export declare class ArbitraryController {
    private readonly arbitraryService;
    constructor(arbitraryService: ArbitraryService);
    findAll(userId: string): Promise<import("@mikro-orm/core").Loaded<import("src/mikroorm/entities/Arbitraries").Arbitraries, "offer.initiator" | "offer.partner" | "arbiter">[]>;
    getHistory(id: string): Promise<string>;
    close(id: string, CloseArbDto: CloseArbDto): Promise<ArbitrariesStatus>;
    dispute(id: string, DisputeArbDto: DisputeArbDto): Promise<ArbitrariesStatus>;
}
