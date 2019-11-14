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

    return await route53
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
};
