import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RequestEntity } from "src/modules/request/entities/request.entity";
import { FileEntity } from "src/modules/file/entities/file.entity";

export enum ReceiptTypeEnum {
  NOTA_FISCAL = "nota_fiscal",
  COMPROVANTE = "comprovante",
  OUTRO = "outro",
}

@Entity("receipt")
export class ReceiptEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: "O identificador único do recibo." })
  id: number;

  @ManyToOne(() => FileEntity, { eager: true })
  @ApiProperty({ type: () => RequestEntity, example: { id: 1, title: "Exemplo de Requisição" }, description: "A requisição associada." })
  file: FileEntity;

  @Column()
  @ApiProperty({ example: 500, description: "O valor comprovado do recibo." })
  provenValue: number;

  @Column({ default: ReceiptTypeEnum.OUTRO })
  @ApiProperty({ enum: ReceiptTypeEnum, description: "O tipo de recibo.", default: ReceiptTypeEnum.OUTRO })
  receiptType: ReceiptTypeEnum;

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
