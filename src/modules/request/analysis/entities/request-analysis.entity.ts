import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RequestEntity } from "../../entities/request.entity";
import { RequestStatusEntity } from "../../status/entities/request-status.entity";

@Entity({ name: "request_analysis" })
export class RequestAnalysisEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar" })
  description: string;

  @ManyToOne(() => User, { eager: true })
  manager: User;

  @ManyToOne(() => RequestEntity, { eager: true })
  request: RequestEntity;

  @ManyToOne(() => RequestStatusEntity, { eager: true })
  status: RequestStatusEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
