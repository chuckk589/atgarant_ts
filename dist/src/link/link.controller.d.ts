import { LinkService } from './link.service';
import { CreateLinkDto } from './dto/create-link.dto';
export declare class LinkController {
    private readonly linkService;
    constructor(linkService: LinkService);
    create(createLinkDto: CreateLinkDto): string;
}
