import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { RequestEntity } from "src/modules/request/entities/request.entity";


@Entity('receipt')
export class ReceiptEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    field: number

    @Column()
    provenValue: number

    @Column()
    receiptType: string

    @ManyToOne(() => RequestEntity, { eager: true })
    request: RequestEntity

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

}
