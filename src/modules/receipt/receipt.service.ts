import { Injectable } from "@nestjs/common";
import { CreateReceiptDto } from "./dto/create-receipt.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ReceiptEntity } from "./entities/receipt.entity";
import { DeepPartial, Repository } from "typeorm";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { NullableType } from "src/utils/types/nullable.type";

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(ReceiptEntity)
    private receiptRepository: Repository<ReceiptEntity>,
  ) {}

  async create(dto: CreateReceiptDto) {
    return this.receiptRepository.save(this.receiptRepository.create(dto));
  }

  findManyWithPagination(paginationOptions: IPaginationOptions): Promise<ReceiptEntity[]> {
    return this.receiptRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findOne(fields: EntityCondition<ReceiptEntity>): Promise<NullableType<ReceiptEntity>> {
    return this.receiptRepository.findOne({
      where: fields,
    });
  }

  update(id: ReceiptEntity["id"], payload: DeepPartial<ReceiptEntity>): Promise<ReceiptEntity> {
    return this.receiptRepository.save(
      this.receiptRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: ReceiptEntity["id"]): Promise<void> {
    await this.receiptRepository.softDelete(id);
  }
}
