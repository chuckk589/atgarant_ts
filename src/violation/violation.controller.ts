import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ViolationService } from './violation.service';
import { CreateViolationDto } from './dto/create-violation.dto';
import { UpdateViolationDto } from './dto/update-violation.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller({
  path: 'violation',
  version: '1'
})
@UseGuards(JwtAuthGuard)
export class ViolationController {
  constructor(private readonly violationService: ViolationService) {}

  @Post()
  create(@Body() createViolationDto: CreateViolationDto) {
    return this.violationService.create(createViolationDto);
  }

  @Get()
  findAll() {
    return this.violationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.violationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViolationDto: UpdateViolationDto) {
    return this.violationService.update(+id, updateViolationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.violationService.remove(+id);
  }
}
