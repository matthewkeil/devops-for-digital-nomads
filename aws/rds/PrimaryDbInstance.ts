import { RDS, Fn } from "cloudform";

export const PrimaryDbInstance = new RDS.DBInstance({
    SourceRegion: process.env.REGION,
    Engine: Fn.Ref("Engine"),
    EngineVersion: Fn.Ref("EngineVersion"),
    DBInstanceClass: Fn.Ref("InstanceClass"),
    DBClusterIdentifier: Fn.Ref("DbCluster"),
    DBInstanceIdentifier: Fn.Join("-", [Fn.Ref("DatabaseName"), "Primary"]),
    // DBParameterGroupName: Fn.Ref('DbInstanceParameterGroup'),
    PubliclyAccessible: false
}).dependsOn("DbCluster");
