import { Injectable } from "@nestjs/common";
import { CreateAccidentDto } from "./dto/create-accident.dto";
import { UpdateAccidentDto } from "./dto/update-accident.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { AccidentEntity } from "./entities/accident.entity";
import { DeepPartial, Repository } from "typeorm";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { NullableType } from "src/utils/types/nullable.type";

@Injectable()
export class AccidentsService {
  constructor(
    @InjectRepository(AccidentEntity)
    private accidentRepository: Repository<AccidentEntity>,
  ) {}

  async create(createAccidentDto: CreateAccidentDto) {
    return this.accidentRepository.save(this.accidentRepository.create(createAccidentDto));
  }

  findManyWithPagination(paginationOptions: IPaginationOptions): Promise<AccidentEntity[]> {
    return this.accidentRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findOne(fields: EntityCondition<AccidentEntity>): Promise<NullableType<AccidentEntity>> {
    return this.accidentRepository.findOne({
      where: fields,
    });
  }

  update(id: AccidentEntity["id"], payload: DeepPartial<AccidentEntity>): Promise<AccidentEntity> {
    return this.accidentRepository.save(
      this.accidentRepository.create({
        id,
        ...payload,
      }),
    );
  }
  async softDelete(id: AccidentEntity["id"]): Promise<void> {
    await this.accidentRepository.softDelete(id);
  }
}
