import {
    Entity,
    PrimaryColumn,
    Column,
    OneToMany,
    UpdateDateColumn
} from "typeorm";
import { DeviceRegistration } from "./DeviceRegistration";

@Entity()
export class Pass {
    @PrimaryColumn()
    public passTypeId!: string;

    @PrimaryColumn()
    public serialNumber!: string;

    @UpdateDateColumn()
    public lastUpdated!: Date;

    // updates serialized into a string using ',' as separator
    // to retrieve you can use find_in_set() MYSQL function
    @Column()
    public updates!: string;

    @Column({ nullable: true })
    public passJson!: string;

    @OneToMany(
        () => DeviceRegistration,
        (reg: DeviceRegistration) => reg.device
    )
    public registrations!: DeviceRegistration[];
}
