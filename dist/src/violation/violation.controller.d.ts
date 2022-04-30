import { ViolationService } from './violation.service';
import { CreateViolationDto } from './dto/create-violation.dto';
import { UpdateViolationDto } from './dto/update-violation.dto';
export declare class ViolationController {
    private readonly violationService;
    constructor(violationService: ViolationService);
    create(createViolationDto: CreateViolationDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateViolationDto: UpdateViolationDto): string;
    remove(id: string): string;
}
