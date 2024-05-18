import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../entities/user.entity";



@Entity({ name: 'user_address' })
export class AddressEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    street?: string | null;

    @Column({ type: 'varchar', nullable: true })
    complement?: string | null;

    @Column({ type: 'varchar', nullable: true })
    number?: string | null;

    @Column({ type: 'varchar', nullable: true })
    city?: string | null;

    @Column({ type: 'varchar', nullable: true })
    locationLatitude?: string | null;

    @Column({ type: 'varchar', nullable: true })
    locationLongitude?: string | null;

    @ManyToOne(() => User, (user) => user.addresses, { eager: false })
    user: User;

}
