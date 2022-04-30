import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateArbDto } from './dto/create-arb.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller({
  path: 'offer',
  version: '1'
})
@UseGuards(JwtAuthGuard)
export class OfferController {
  constructor(private readonly offerService: OfferService) { }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.offerService.findAll(userId);
  }

  @Post(':id/action')
  close(@Param('id') id: string) {
    return this.offerService.offerAction(id);
  }

  @Post(':id/arbitrary')
  arbitrary(@Param('id') id: string, @Body() CreateArbDto: CreateArbDto) {
    return this.offerService.createArb(id, CreateArbDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offerService.update(+id, updateOfferDto);
  }
}
