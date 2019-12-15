import { config } from "../../../config";
import { emptyBucket } from "./emptyBucket";

const { S3 } = config;

export const deleteBucket = async ({ Bucket }: { Bucket: string }) => {
    console.log(`deleting bucket named ${Bucket}`);

    await emptyBucket({ Bucket });

    try {
        await S3.deleteBucket({ Bucket }).promise();
    } catch (err) {
        // sometimes it takes a second attempt to get bucket deleted
        await S3.deleteBucket({ Bucket }).promise();
    }

    console.log(`finished deleting bucket ${Bucket}`);
};
