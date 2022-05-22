import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WebappService } from './webapp.service';
import { RetrieveWebAppUser } from './dto/retrieve-user.dto';

@Controller({
  path: 'webapp',
  version: '1',
})
export class WebappController {
  constructor(private readonly webappService: WebappService) {}

  // @Post()
  // create(@Body() createWebappDto: CreateWebappDto) {
  //   return this.webappService.create(createWebappDto);
  // }
  @Get('configs')
  findConfigs() {
    return this.webappService.findConfigs();
  }
  @Get('user')
  getUsers(@Query('partial') user?: string): Promise<RetrieveWebAppUser[]> {
    return this.webappService.getUsers(user);
  }
  @Get()
  findAll() {
    return this.webappService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.webappService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWebappDto: UpdateWebappDto) {
  //   return this.webappService.update(+id, updateWebappDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.webappService.remove(+id);
  }
}
