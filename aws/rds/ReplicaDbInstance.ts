import { RDS, Fn } from "cloudform";
import uuid = require("uuid");

export const ReplicaDbInstance = new RDS.DBInstance({
    SourceRegion: process.env.REGION,
    Engine: Fn.Ref("Engine"),
    EngineVersion: Fn.Ref("EngineVersion"),
    DBInstanceClass: Fn.Ref("InstanceClass"),
    DBClusterIdentifier: Fn.Ref("DbCluster"),
    DBInstanceIdentifier: Fn.Join("-", [
        Fn.Ref("DatabaseName"),
        "Replica",
        uuid.v4().slice(0, 5)
    ]),
    // DBParameterGroupName: Fn.Ref('DbInstanceParameterGroup'),
    PubliclyAccessible: false
}).dependsOn("PrimaryDbInstance");
