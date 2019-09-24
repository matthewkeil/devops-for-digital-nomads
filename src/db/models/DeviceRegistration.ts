import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne
} from "typeorm";

import { Device } from "./Device";
import { Pass } from "./Pass";

@Entity()
export class DeviceRegistration {
    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public pushToken!: string;

    @ManyToOne(() => Device, (device: Device) => device.registrations)
    @JoinColumn()
    public device!: Device;

    @ManyToOne(() => Pass)
    @JoinColumn([
        {
            name: "passTypeId",
            referencedColumnName: "passTypeId"
        },
        { name: "serialNumber", referencedColumnName: "serialNumber" }
    ])
    public pass!: Pass;
}
