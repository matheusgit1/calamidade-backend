import { User } from "src/modules/user/entities/user.entity";
import { EntityHelper } from "src/utils/entity-helper";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('organization')
export class Organization extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: String, unique: true, nullable: true })
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  document: string;

  @Column({ type: String, nullable: true })
  address_street?: string | null

  @Column({ type: String, nullable: true })
  address_number?: string | null

  @Column({ type: String, nullable: true })
  address_neighborhood?: string | null

  @Column({ type: String, nullable: true })
  address_city?: string | null

  @Column({ type: String, nullable: true })
  address_zipcode?: string | null

  @ManyToOne(() => User, {
    eager: true,
  })
  manager: User

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
