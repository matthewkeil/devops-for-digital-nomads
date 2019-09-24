import { RDS, Fn } from "cloudform";

export const DbCluster = new RDS.DBCluster({
    SourceRegion: process.env.REGION,
    MasterUsername: process.env.DB_USERNAME || "root",
    MasterUserPassword: process.env.DB_PASSWORD || "password",
    Engine: Fn.Ref("Engine"),
    EngineMode: Fn.Ref("EngineMode"),
    EngineVersion: Fn.Ref("EngineVersion"),
    DatabaseName: Fn.Ref("DatabaseName"),
    DBClusterIdentifier: Fn.Join("-", [
        "passninja-database",
        Fn.Ref("Stage"),
        "cluster"
    ]),
    // DBClusterParameterGroupName: Fn.Ref('DbClusterParameterGroup'),
    StorageEncrypted: true,
    EnableIAMDatabaseAuthentication: false
});
