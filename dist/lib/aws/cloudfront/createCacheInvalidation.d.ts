import * as AWS from "aws-sdk";
export declare const createCacheInvalidation: ({ DistributionId, Bucket }: {
    Bucket?: string;
    DistributionId?: string;
}) => Promise<import("aws-sdk/lib/request").PromiseResult<AWS.CloudFront.CreateInvalidationResult, AWS.AWSError>>;
