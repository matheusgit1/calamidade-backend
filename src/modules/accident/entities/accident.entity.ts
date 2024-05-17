import { FileEntity } from "src/modules/files/entities/file.entity";
import { EntityHelper } from "src/utils/entity-helper";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'accident' })
export class AccidentEntity extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "number", nullable: true, name: "fileId" })
  file_id: number;

  @Column({ type: "number", nullable: true, name: "requestId" })
  request_id: number;

  @OneToOne(() => FileEntity)
  file?: FileEntity | null
}
