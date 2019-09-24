import "reflect-metadata";
import { Connection, ConnectionOptions, createConnection } from "typeorm";
import { DeviceRegistration } from "./models/DeviceRegistration";
import { Device } from "./models/Device";
import { Pass } from "./models/Pass";
import { ENV } from "../utils";

// const REGION = ENV.REGION;
// const DBASE_CLUSTER_ID = ENV.DBASE_CLUSTER_ID;
// const DBASE_CLUSER_NAME = ENV.DBASE_CLUSER_NAME;

const config: ConnectionOptions = {
    host: ENV.DB_CLUSTER_ADDRESS,
    port: ENV.DB_PORT,
    database: ENV.DB_NAME,
    username: ENV.DB_USERNAME,
    password: ENV.DB_PASSWORD,
    type: "mysql",
    logging: "all",
    synchronize: true,
    entities: [DeviceRegistration, Device, Pass]
};

export const getDbConnection = async (): Promise<Connection> => {
    // const connectionManager = getConnectionManager();

    // if (!connectionManager.has(CONNECTION_NAME)) {
    //     return await connectionManager.create(config);
    // }

    let connection = await createConnection(config); // connectionManager.get(CONNECTION_NAME);

    // if (!connection.isConnected) {
    //     connection = await connection.connect();
    // }

    return connection;
};
