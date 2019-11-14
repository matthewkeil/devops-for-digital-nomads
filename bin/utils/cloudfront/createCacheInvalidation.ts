import * as AWS from "aws-sdk";
import { config } from "../../../config";
import { getDistributionForBucket } from "./getDistributionForBucket";

const cloudfront = new AWS.CloudFront(config.AWS_SERVICE_CONFIG);

export const createCacheInvalidation = async ({
    DistributionId,
    Bucket
}: {
    Bucket?: string;
    DistributionId?: string;
}) => {
    const invalidate = (id: string) =>
        cloudfront
            .createInvalidation({
                DistributionId: id,
                InvalidationBatch: {
                    CallerReference: `${Date.now()}`,
                    Paths: {
                        Quantity: 1,
                        Items: ["/*"]
                    }
                }
            })
            .promise();

    const id = DistributionId
        ? DistributionId
        : await getDistributionForBucket({ Bucket });

    if (!id) {
        throw new Error(
            "must provide wither Bucekt with an assoicated distribution or DistributionID to create an invalidation"
        );
    }

    console.log(`attempting to invalidate DistributionId: ${id}`);

    return await invalidate(id);
};
