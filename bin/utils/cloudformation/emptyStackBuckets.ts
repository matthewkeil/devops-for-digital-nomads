import { emptyBucket } from "../s3/emptyBucket";
import { config } from "../../../config";

const { CF } = config;

export const emptyStackBuckets = async ({
    StackName
}: AWS.CloudFormation.DeleteStackInput) => {
    console.log(`looking for s3 buckets to empty in stack ${StackName}`);

    const response: any = await CF.listStackResources({ StackName }).promise();

    const bucketPhysicalResourceIds: string[] = response.StackResourceSummaries.filter(
        (resource: any) => resource.ResourceType === "AWS::S3::Bucket"
    ).map((resource: any) => resource.PhysicalResourceId);

    console.log(
        `stack has buckets named ${bucketPhysicalResourceIds.join(", ")}`
    );

    await Promise.all(
        bucketPhysicalResourceIds.map(Bucket => {
            return emptyBucket({ Bucket });
        })
    );
};
