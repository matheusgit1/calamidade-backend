import { Injectable } from '@nestjs/common';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { UpdateAccidentDto } from './dto/update-accident.dto';

@Injectable()
export class AccidentService {
  create(createAccidentDto: CreateAccidentDto) {
    return 'This action adds a new accident';
  }

  findAll() {
    return `This action returns all accident`;
  }

  findOne(id: number) {
    return `This action returns a #${id} accident`;
  }

  update(id: number, updateAccidentDto: UpdateAccidentDto) {
    return `This action updates a #${id} accident`;
  }

  remove(id: number) {
    return `This action removes a #${id} accident`;
  }
}
