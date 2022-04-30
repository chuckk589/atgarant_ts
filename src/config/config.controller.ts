import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ConfigService } from './config.service';
import { UpdateConfigDto } from './dto/update-config.dto';

@Controller({
  path: 'config',
  version: '1'
})
@UseGuards(JwtAuthGuard)
export class ConfigController {
  constructor(private readonly configService: ConfigService) { }

  @Put()
  update(@Body() updateConfigDto: UpdateConfigDto) {
    return this.configService.update(updateConfigDto);
  }

  @Get('reboot')
  reboot() {
    return process.exit()
  }
  @Get()
  findAll() {
    return this.configService.findAll();
  }
}
