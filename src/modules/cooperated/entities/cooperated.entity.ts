import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EntityHelper } from '../../../utils/entity-helper';
import { Expose } from 'class-transformer';

@Entity()
export class Cooperated extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, unique: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  email: string | null;

  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Column({ type: String, nullable: true })
  lastName: string | null;

  @Column({ type: String, nullable: true })
  phone: string | null;
}
