import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestHelpTypeEntity } from 'src/modules/request/help-type/entities/request-help-type.entity';
import { RequestHelpTypeEnum } from 'src/modules/request/enums/help-type.enum';

@Injectable()
export class RequestHelpTypeSeedService {
  constructor(
    @InjectRepository(RequestHelpTypeEntity)
    private requestHelpTypeRepository: Repository<RequestHelpTypeEntity>
  ) {}

  async run() {
    const count = await this.requestHelpTypeRepository.count();

    if (count === 0) {
      const keys = Object.keys(RequestHelpTypeEnum).filter((v) => isNaN(Number(v)));

      for (const key of keys) {
        const id = RequestHelpTypeEnum[key] as number;
        await this.requestHelpTypeRepository.save(
          this.requestHelpTypeRepository.create({
            id,
            name: key
          })
        )
      }
    }
  }
}
