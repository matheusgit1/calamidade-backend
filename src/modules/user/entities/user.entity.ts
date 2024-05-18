import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from 'typeorm';
import { UserRole } from './user-role.entity';
import { UserStatus } from './user-status.entity';
import { FileEntity } from '../../file/entities/file.entity';
import bcrypt from 'bcryptjs';
import { EntityHelper } from 'src/utils/entity-helper';
import { AuthProvidersEnum } from 'src/modules/auth/auth-providers.enum';
import { Exclude, Expose } from 'class-transformer';
import { OrganizationEntity } from 'src/modules/organization/entities/organization.entity';
import { RequestEntity } from 'src/modules/request/entities/request.entity';

@Entity({ name: 'user' })
export class User extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Exclude({ toPlainOnly: true })
  public previousPassword: string;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  socialId: string | null;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  firstName: string | null;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  lastName: string | null;

  @ManyToOne(() => FileEntity, { eager: true })
  photo?: FileEntity | null;

  @ManyToOne(() => OrganizationEntity, { eager: true })
  @Expose({ groups: ['me', 'admin'] })
  organization?: OrganizationEntity | null;

  @ManyToOne(() => UserRole, { eager: true })
  role?: UserRole | null;

  @ManyToOne(() => UserStatus, { eager: true })
  status?: UserStatus;

  requests?: RequestEntity[]

  @Column({ type: 'varchar', nullable: true })
  @Index()
  @Exclude({ toPlainOnly: true })
  hash: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
