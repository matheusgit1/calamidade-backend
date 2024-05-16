import { User } from 'src/modules/user/entities/user.entity';
import { EntityHelper } from 'src/utils/entity-helper';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'organization' })
export class OrganizationEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', unique: true })
  @Index()
  document: string;

  @Column({ type: 'varchar', nullable: true })
  address_street?: string | null;

  @Column({ type: 'varchar', nullable: true })
  address_number?: string | null;

  @Column({ type: 'varchar', nullable: true })
  address_neighborhood?: string | null;

  @Column({ type: 'varchar', nullable: true })
  address_city?: string | null;

  @Column({ type: 'varchar', nullable: true })
  address_zipcode?: string | null;

  @ManyToOne(() => User, { eager: false })
  manager?: User | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
