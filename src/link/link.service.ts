import { Injectable } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';

@Injectable()
export class LinkService {
  create(createLinkDto: CreateLinkDto) {
    return 'This action adds a new link';
  }
}
