import { config } from "../../../config";

const { S3 } = config;

export const bucketExists = async ({ Bucket }: { Bucket: string }) => {
    const list = await S3.listBuckets().promise();

    if (list.Buckets) {
        const bucket = list.Buckets.find(bucket => {
            if (bucket.Name) {
                return bucket.Name.includes(Bucket);
            }
        });

        if (bucket) {
            return true;
        }
    }

    return false;
};
