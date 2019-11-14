import AWS from "aws-sdk";
import { config } from "../../../config";

const { CF } = config;
const route53 = new AWS.Route53(config.AWS_SERVICE_CONFIG);

interface CertRecordSetParams {
    StackName: string;
    recordSetName: string;
    recordSetValue: string;
}

export const createCertRecordSet = async ({
    StackName,
    recordSetName,
    recordSetValue
}: CertRecordSetParams) => {
    const { StackResourceSummaries } = await CF.listStackResources({
        StackName
    }).promise();

    const { PhysicalResourceId: HostedZoneId } = StackResourceSummaries.find(
        resource => resource.ResourceType === "AWS::Route53::HostedZone"
    );

    const { ResourceRecordSets } = await route53
        .listResourceRecordSets({
            HostedZoneId,
            StartRecordName: recordSetName,
            StartRecordType: "CNAME"
        })
        .promise();

    if (!!ResourceRecordSets.length) {
        return;
    }

    console.log(
        `found request for SSL RecordSet creation at\n${recordSetName}\nfor validation by\n${recordSetValue}\n`
    );

    await route53
        .changeResourceRecordSets({
            HostedZoneId,
            ChangeBatch: {
                Changes: [
                    {
                        Action: "UPSERT",
                        ResourceRecordSet: {
                            Name: recordSetName,
                            ResourceRecords: [
                                {
                                    Value: recordSetValue
                                }
                            ],
                            TTL: 60,
                            Type: "CNAME"
                        }
                    }
                ],
                Comment: "RecordSet for SSL Certificate Validation"
            }
        })
        .promise();

    console.log("successfully created SSL RecordSet for DNS validation");
};
