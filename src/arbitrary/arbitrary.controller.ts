import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ArbitraryService } from './arbitrary.service';
import { CloseArbDto } from './dto/close-arbitrary.dto';
import { DisputeArbDto } from './dto/dispute-arbitrary.dto';
import { ArbitrariesStatus } from 'src/mikroorm/entities/Arbitraries';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller({
  path: 'arbitrary',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class ArbitraryController {
  constructor(private readonly arbitraryService: ArbitraryService) {}

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.arbitraryService.findAll(userId);
  }

  @Get(':id/history')
  getHistory(@Param('id') id: string): Promise<string> {
    return this.arbitraryService.getHistory(id);
  }

  @Post(':id/close')
  close(@Param('id') id: string, @Body() CloseArbDto: CloseArbDto): Promise<ArbitrariesStatus> {
    return this.arbitraryService.closeArb(id, CloseArbDto);
  }

  @Post(':id/dispute')
  dispute(@Param('id') id: string, @Body() DisputeArbDto: DisputeArbDto): Promise<ArbitrariesStatus> {
    return this.arbitraryService.disputeArb(id, DisputeArbDto);
  }
}
