import * as AWS from "aws-sdk";

/**
 *
 * setup for AWS services
 *
 */
const AWS_SERVICE_CONFIG = {
    region: process.env.REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

const S3 = new AWS.S3(AWS_SERVICE_CONFIG);
const CF = new AWS.CloudFormation(AWS_SERVICE_CONFIG);

export const getArtifactsBucketName = ({
    repo,
    branch
}: {
    repo: string;
    branch: string;
}) => {
    return `${repo}-${branch}-artifacts`;
};

const createArtifactsBucket = async ({
    repo,
    branch
}: {
    repo: string;
    branch: string;
}) => {
    const bucketName = getArtifactsBucketName({ repo, branch });

    console.log(`creating artifacts bucket named ${bucketName}`);

    await S3.createBucket({
        Bucket: bucketName
    }).promise();

    return bucketName;
};

export const getArtifactsBucket = async ({
    repo,
    branch
}: {
    repo: string;
    branch: string;
}) => {
    const bucketName = getArtifactsBucketName({ repo, branch });

    const list = await S3.listBuckets().promise();

    if (list.Buckets) {
        let bucket = list.Buckets.find(bucket => {
            if (bucket.Name) {
                return bucket.Name.includes(bucketName);
            }
        });

        if (bucket) {
            console.log(`found existing artifacts bucket`);
            return bucketName;
        }
    }

    return await createArtifactsBucket({ repo, branch });
};

export const emptyBucket = async (Bucket: string) => {
    const { Contents } = await S3.listObjects({
        Bucket
    }).promise();

    if (Contents && !!Contents.length) {
        console.log(`attempting to empty ${Bucket}`);
        Contents.forEach(async ({ Key }) => {
            // @ts-ignore error in ts definition for .promise()
            await S3.deleteObject({
                // @ts-ignore error in ts definition for .promise()
                Bucket,
                // @ts-ignore error in ts definition for .promise()
                Key
            }).promise();
        });
    }
};

export const emptyStackBuckets = async ({
    StackName
}: AWS.CloudFormation.DeleteStackInput) => {
    console.log(`looking for artifacts and cache buckets for ${StackName}`);

    const response: any = await CF.listStackResources({ StackName }).promise();

    const bucketPhysicalResourceIds: string[] = response.StackResourceSummaries.filter(
        (resource: any) => resource.ResourceType === "AWS::S3::Bucket"
    ).map((resource: any) => resource.PhysicalResourceId);

    console.log(
        `stack has buckets named ${bucketPhysicalResourceIds.join(", ")}`
    );

    bucketPhysicalResourceIds.forEach(
        async Bucket => await emptyBucket(Bucket)
    );
};
