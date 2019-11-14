import { config } from "../../../config";

const { S3 } = config;

export const createBucketWithFolders = async ({
    Bucket,
    folders
}: {
    Bucket: string;
    folders?: string[];
}) => {
    await S3.createBucket({
        Bucket
    }).promise();

    if (Array.isArray(folders)) {
        for (const folder of folders) {
            await S3.putObject({
                Bucket,
                Key: `${folder}/`
            }).promise();
        }
    }

    return Bucket;
};
