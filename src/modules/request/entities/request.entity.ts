import { ColumnNumericTransformer } from "src/utils/transformers/column-numeric.transformer";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RequestStatus } from "./request-status.entity";
import { RequestHelpType } from "./request-help-type.entity";
import { RequestStatusEnum } from "../enums/status.enum";
import { User } from "src/modules/user/entities/user.entity";
import { EntityHelper } from "src/utils/entity-helper";

@Entity({ name: 'request' })
export class RequestEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, transformer: new ColumnNumericTransformer() })
  amount: number;

  @ManyToOne(() => RequestStatus, { eager: true, nullable: false })
  status: RequestStatus;

  @Column({ default: RequestStatusEnum.analysis })
  statusId: number

  @ManyToOne(() => RequestHelpType, { eager: true, nullable: false })
  helpType: RequestHelpType;

  @Column({ type: 'varchar', nullable: true })
  chavePix: string;

  @Column({ type: 'varchar', nullable: true })
  banco: string;

  @Column({ type: 'varchar', nullable: true })
  agencia: string;

  @Column({ type: 'varchar', nullable: true })
  conta: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => User, { eager: true, nullable: true })
  godFather?: User | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
