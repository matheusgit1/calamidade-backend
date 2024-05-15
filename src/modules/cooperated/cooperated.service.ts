import { Injectable } from '@nestjs/common';
import { CreateCooperatedDto } from './dto/create-cooperated.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cooperated } from './entities/cooperated.entity';
import { DeepPartial, Repository, getManager } from 'typeorm';
import { IPaginationOptions } from '../../utils/types/pagination-options';
import { EntityCondition } from '../../utils/types/entity-condition.type';
import { NullableType } from '../../utils/types/nullable.type';

@Injectable()
export class CooperatedService {
  constructor(
    @InjectRepository(Cooperated)
    private cooperatedRepository: Repository<Cooperated>,
  ) {}

  create(createCooperatedDto: CreateCooperatedDto) {
    return this.cooperatedRepository.save(
      this.cooperatedRepository.create(createCooperatedDto),
    );
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<Cooperated[]> {
    return this.cooperatedRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findOne(
    fields: EntityCondition<Cooperated>,
  ): Promise<NullableType<Cooperated>> {
    return this.cooperatedRepository.findOne({
      where: fields,
    });
  }

  update(
    id: Cooperated['id'],
    payload: DeepPartial<Cooperated>,
  ): Promise<Cooperated> {
    return this.cooperatedRepository.save(
      this.cooperatedRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: Cooperated['id']): Promise<void> {
    await this.cooperatedRepository.softDelete(id);
  }

  async createBulk(createCooperatedDtos: CreateCooperatedDto[]): Promise<void> {
    const cooperatedEntities = createCooperatedDtos.map((dto) => {
      const cooperated = new Cooperated();
      cooperated.email = dto.email;
      cooperated.firstName = dto.firstName;
      cooperated.lastName = dto.lastName;
      cooperated.phone = dto.phone;
      cooperated.document = dto.document;
      return cooperated;
    });

    await Cooperated.save(cooperatedEntities);
  }
}
