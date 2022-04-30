import { CreateViolationDto } from './dto/create-violation.dto';
import { UpdateViolationDto } from './dto/update-violation.dto';
export declare class ViolationService {
    create(createViolationDto: CreateViolationDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateViolationDto: UpdateViolationDto): string;
    remove(id: number): string;
}
