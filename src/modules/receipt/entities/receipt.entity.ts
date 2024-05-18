import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RequestEntity } from "src/modules/request/entities/request.entity";
import { FileEntity } from "src/modules/file/entities/file.entity";
import { ReceiptType } from "./receipt-type.entity";
import { ReceiptTypeEnum } from "../enums/receipt-type.enum";
import { ColumnNumericTransformer } from "src/utils/transformers/column-numeric.transformer";

@Entity("receipt")
export class ReceiptEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: "O identificador único do recibo." })
  id: number;

  @ManyToOne(() => FileEntity, { eager: true })
  @ApiProperty({ type: () => RequestEntity, example: { id: 1, title: "Exemplo de Requisição" }, description: "A requisição associada." })
  file: FileEntity;

  @ApiProperty({ example: 500.2, description: "O valor comprovado do recibo." })
  @Column({ type: "numeric", precision: 10, scale: 2, transformer: new ColumnNumericTransformer() })
  provenValue: number;

  @ManyToOne(() => ReceiptType, { eager: true })
  @ApiProperty({ enum: ReceiptTypeEnum, description: "O tipo de recibo.", default: ReceiptTypeEnum.OTHER })
  receiptType?: ReceiptType;

  @ManyToOne(() => RequestEntity, { eager: true })
  @ApiProperty({ type: () => RequestEntity, example: { id: 1, title: "Exemplo de Requisição" }, description: "A requisição associada." })
  request: RequestEntity;

  @CreateDateColumn()
  @ApiProperty({ example: "2024-05-18T12:00:00Z", description: "A data e hora em que o recibo foi criado." })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: "2024-05-18T13:30:00Z", description: "A data e hora da última atualização do recibo." })
  updatedAt: Date;

  @DeleteDateColumn()
  @ApiProperty({ example: "2024-05-19T09:45:00Z", description: "A data e hora em que o recibo foi excluído." })
  deletedAt: Date;
}
