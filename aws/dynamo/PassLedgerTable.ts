import { DynamoDB } from "cloudform";

export const PassLedgerTable = (branch: string) =>
    new DynamoDB.Table({
        TableName: `passninja-api-${branch}-table`,
        SSESpecification: {
            SSEEnabled: false
        },
        BillingMode: "PAY_PER_REQUEST",
        /* BillingMode: 'PROVISIONED',
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }, */
        StreamSpecification: {
            StreamViewType: "NEW_IMAGE"
        },
        KeySchema: [
            {
                AttributeName: "serialNumber",
                KeyType: "HASH"
            }
        ],
        AttributeDefinitions: [
            {
                AttributeName: "serialNumber",
                AttributeType: "S"
            }
        ]
    });
