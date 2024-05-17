import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('receipt')
export class Receipt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    field: number

    @Column()
    provenValue: number

    @Column()
    receiptType: string

    @Column()
    requestId: number

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

}
