import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateReceiptDto } from "./dto/create-receipt.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ReceiptEntity } from "./entities/receipt.entity";
import { DeepPartial, Repository } from "typeorm";
import { IPaginationOptions } from "src/utils/types/pagination-options";
import { EntityCondition } from "src/utils/types/entity-condition.type";
import { NullableType } from "src/utils/types/nullable.type";
import { RequestEntity } from "../request/entities/request.entity";
import { RequestStatusEnum } from "../request/enums/status.enum";

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(ReceiptEntity)
    private receiptRepository: Repository<ReceiptEntity>,
    private requestRepository: Repository<RequestEntity>,
  ) {}

  async create(dto: CreateReceiptDto) {
    // Verificar se a requisição existe e está deferida
    const request = await this.requestRepository.findOne({
      where: { id: +dto.request },
      relations: ["receipts"],
    });

    if (!request) {
      throw new BadRequestException("Requisição não encontrada.");
    }

    if (request.statusId !== RequestStatusEnum.accepted) {
      throw new BadRequestException("Só é permitido adicionar recibos em solicitações deferidas.");
    }

    // Verificar se o valor comprovado não é superior ao valor da solicitação
    if (dto.provenValue > request.amount) {
      throw new BadRequestException("O valor comprovado não pode ser superior ao valor da solicitação.");
    }

    // Verificar se a soma dos valores comprovados não excede o valor da solicitação
    const existingReceipts = await this.receiptRepository.find({ where: { request: { id: +dto.request } } });
    const totalProvenValue = existingReceipts.reduce((sum, receipt) => sum + receipt.provenValue, 0);

    if (totalProvenValue + dto.provenValue > request.amount) {
      throw new BadRequestException("A soma dos valores comprovados de todos os recibos não pode exceder o valor total da solicitação.");
    }

    // Criar e salvar o novo recibo
    const receipt = this.receiptRepository.create(dto);
    const savedReceipt = await this.receiptRepository.save(receipt);

    // Verificar se a solicitação deve ser alterada para deferido_liquidado
    if (totalProvenValue + dto.provenValue === request.amount) {
      request.statusId = RequestStatusEnum.concluded;
      await this.requestRepository.save(request);
    }

    return savedReceipt;
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
