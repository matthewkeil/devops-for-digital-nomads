import { default as CF, Fn } from "cloudform";
import { PassLedgerTable } from "./dynamo/PassLedgerTable";

export default (branch: string) =>
    CF({
        AWSTemplateFormatVersion: "2010-09-09",
        Description: `passninja-api-${branch}-dbase`,
        Parameters: {
            GitHubBranch: {
                Description: "Branch name to deploy dynamodb with",
                Type: "String",
                Default: branch
            }
        },
        Resources: {
            PassLedgerTable: PassLedgerTable(branch)
        },
        Outputs: {
            PassLedgerTableName: {
                Description:
                    "Name of DynamoDB table with Pass ledger information",
                Value: Fn.Ref("PassLedgerTable"),
                Export: { Name: `PassLedgerTableName-${branch}` }
            },
            PassLedgerTableStreamArn: {
                Description:
                    "Arn of DynamoDBStream associated with PassLedgerTable",
                Value: Fn.GetAtt("PassLedgerTable", "StreamArn"),
                Export: { Name: `PassLedgerTableStreamArn-${branch}` }
            }
        }
    });
