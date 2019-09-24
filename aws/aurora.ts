import { default as CF, Fn } from "cloudform";
import { capitalizeFirstLetter } from "../bin/utils";

// import { DbClusterParameterGroup } from './rds/DbClusterParameterGroup';
// import { DbInstanceParameterGroup } from './rds/DbInstanceParameterGroup';
import { DbCluster } from "./rds/DbCluster";
// import { PrimaryDbInstance } from "./rds/PrimaryDbInstance";
// import { ReplicaDbInstance } from './rds/ReplicaDbInstance';

export default (branch: string) =>
    CF({
        AWSTemplateFormatVersion: "2010-09-09",
        Description: `passninja-api-${branch}-aurora`,
        Parameters: {
            Stage: {
                Description: "Database stage (is master, staging, etc)",
                Type: "String",
                Default: branch
            },
            DatabaseName: {
                Description: "Name of the database",
                Type: "String",
                Default: `PassNinjaDatabase${capitalizeFirstLetter(branch)}`
            },
            InstanceClass: {
                Description: "Type of RDS instance to host database on",
                Type: "String",
                Default: "db.t2.small"
            },
            Engine: {
                Description: "Type of RDS instance to host database on",
                Type: "String",
                Default: "aurora",
                AllowedValues: ["aurora"]
            },
            EngineVersion: {
                Description: "Type of RDS instance to host database on",
                Type: "String",
                Default: "5.6.10a",
                AllowedValues: ["5.6.10a"]
            },
            EngineMode: {
                Description: "Mode the engine will run in",
                Type: "String",
                Default: "provisioned",
                AllowedValues: ["provisioned", "serverless"]
            }
        },
        Resources: {
            // DbClusterParameterGroup,
            // DbInstanceParameterGroup
            // PrimaryDbInstance,
            DbCluster
        },
        Outputs: {
            DbClusterEndpoint: {
                Description: "Host address for Aurora Cluster",
                Value: Fn.GetAtt("DbCluster", "Endpoint.Address"),
                Export: { Name: `DbClusterEndpoint` }
            },
            DbClusterPort: {
                Description: "Port for Aurora Cluster",
                Value: Fn.GetAtt("DbCluster", "Endpoint.Port"),
                Export: { Name: `DbClusterPort` }
            }
        }
    });
