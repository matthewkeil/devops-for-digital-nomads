import { config } from "../../../config";

const { S3 } = config;

export const emptyBucket = async ({ Bucket }: { Bucket: string }) => {
    console.log(`attempting to empty ${Bucket}`);

    const { Contents } = await S3.listObjects({
        Bucket
    }).promise();

    if (Contents && !!Contents.length) {
        await Promise.all(
            Contents.map(({ Key }) =>
                S3.deleteObject({
                    Bucket,
                    Key
                }).promise()
            )
        );

        console.log(`Bucket ${Bucket} is empty`);
    }
};
