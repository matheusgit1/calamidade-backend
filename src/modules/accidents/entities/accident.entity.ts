import { FileEntity } from "../../../modules/file/entities/file.entity";
import { RequestEntity } from "../../../modules/request/entities/request.entity";
import { EntityHelper } from "../../../utils/entity-helper";
import { CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "accident" })
export class AccidentEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => RequestEntity, { cascade: true })
  @JoinColumn()
  request: RequestEntity;

  @OneToOne(() => FileEntity, { cascade: true })
  @JoinColumn()
  file: FileEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
