import CF from "cloudform";
import { config } from "../config";

import { ClientBucket } from "./s3/ClientBucket";
import { ClientBucketPolicy } from "./s3/ClientBucketPolicy";
import { ClientOriginAccessIdentity } from "./cloudfront/ClientOriginAccessIdentity";
import { ClientDistribution } from "./cloudfront/ClientDistribution";
import { ClientRecordSet } from "./route53/ClientRecordSet";

export const clientTemplate = ({
    branch,
    StackName
}: {
    branch: string;
    StackName: string;
}) => {
    const template = {
        AWSTemplateFormatVersion: "2010-09-09",
        Description: StackName,
        Parameters: {
            SubDomain: {
                Description:
                    "Sub-domain prefix to add to dns ${SubDomain}.${RootDomain}",
                Type: "String",
                Default: branch === "master" ? "www" : branch
            }
        },
        Resources: {
            ClientOriginAccessIdentity,
            ClientDistribution,
            ClientRecordSet,
            ClientBucketPolicy,
            ClientBucket
        }
    };

    if (branch === "master") {
        (template.Resources.ClientDistribution.Properties.DistributionConfig
            .Aliases as any).push(config.ROOT_DOMAIN);
        (template.Resources as any).ClientRootRecordSet = Object.assign(
            {},
            ClientRecordSet,
            {
                Properties: {
                    ...ClientRecordSet.Properties,
                    Name: config.ROOT_DOMAIN
                }
            }
        );
    }

    return CF(template);
};
