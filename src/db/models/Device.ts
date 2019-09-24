import { Entity, PrimaryColumn, OneToMany, Column } from "typeorm";
import { DeviceRegistration } from "./DeviceRegistration";

@Entity()
export class Device {
    @PrimaryColumn()
    public deviceLibraryIdentifier!: string;

    @Column()
    public pushToken!: string;

    @OneToMany(
        () => DeviceRegistration,
        (reg: DeviceRegistration) => reg.device
    )
    public registrations!: DeviceRegistration[];
}
