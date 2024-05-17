import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccidentService } from './accident.service';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { UpdateAccidentDto } from './dto/update-accident.dto';

@Controller('accident')
export class AccidentController {
  constructor(private readonly accidentService: AccidentService) {}

  @Post()
  create(@Body() createAccidentDto: CreateAccidentDto) {
    return this.accidentService.create(createAccidentDto);
  }

  @Get()
  findAll() {
    return this.accidentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accidentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccidentDto: UpdateAccidentDto) {
    return this.accidentService.update(+id, updateAccidentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accidentService.remove(+id);
  }
}
