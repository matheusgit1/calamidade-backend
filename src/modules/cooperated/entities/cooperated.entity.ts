import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { EntityHelper } from "../../../utils/entity-helper";
import { Expose } from "class-transformer";
import { OrganizationEntity } from "src/modules/organization/entities/organization.entity";

@Entity()
export class Cooperated extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: String, nullable: true })
  @Expose({ groups: ["me", "admin"] })
  email: string | null;

  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Column({ type: String, nullable: true })
  lastName: string | null;

  @Column({ type: String, nullable: true })
  phone: string | null;

  @Index({ unique: true })
  @Column({ type: String, nullable: true })
  document: string | null;

  @ManyToOne(() => OrganizationEntity, { eager: false })
  organization?: OrganizationEntity | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
