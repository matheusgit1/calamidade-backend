import { EntityHelper } from "src/utils/entity-helper";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "accident" })
export class AccidentEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  requestId: number;

  @Column()
  fileld: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
