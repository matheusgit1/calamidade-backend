import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestStatus } from 'src/modules/request/entities/request-status.entity';
import { RequestStatusEnum } from 'src/modules/request/enums/status.enum';

@Injectable()
export class RequestStatusSeedService {
  constructor(
    @InjectRepository(RequestStatus)
    private requestStatusRepository: Repository<RequestStatus>
  ) {}

  async run() {
    const count = await this.requestStatusRepository.count();

    if (count === 0) {
      const keys = Object.keys(RequestStatusEnum).filter((v) => isNaN(Number(v)));

      for (const key of keys) {
        const id = RequestStatusEnum[key] as number;
        await this.requestStatusRepository.save(
          this.requestStatusRepository.create({
            id,
            name: key
          })
        )
      }
    }
  }
}
