import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RequestEntity } from "src/modules/request/entities/request.entity";

@Entity("receipt")
export class ReceiptEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: "The unique identifier of the receipt." })
  id: number;

  @Column()
  @ApiProperty({ example: 12345, description: "The value of the field." })
  field: number;

  @Column()
  @ApiProperty({ example: 500, description: "The proven value of the receipt." })
  provenValue: number;

  @Column()
  @ApiProperty({ example: "expense", description: "The type of the receipt." })
  receiptType: string;

  @ManyToOne(() => RequestEntity, { eager: true })
  @ApiProperty({ type: () => RequestEntity, example: { id: 1, title: "Sample Request" }, description: "The associated request." })
  request: RequestEntity;

  @CreateDateColumn()
  @ApiProperty({ example: "2024-05-18T12:00:00Z", description: "The date and time when the receipt was created." })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: "2024-05-18T13:30:00Z", description: "The date and time when the receipt was last updated." })
  updatedAt: Date;

  @DeleteDateColumn()
  @ApiProperty({ example: "2024-05-19T09:45:00Z", description: "The date and time when the receipt was deleted." })
  deletedAt: Date;
}
