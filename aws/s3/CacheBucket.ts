import { S3, Fn, Refs } from "cloudform";
import { LifecycleConfiguration, Rule } from "cloudform-types/types/s3/bucket";

export const CacheBucket = new S3.Bucket({
    BucketName: Fn.Join("-", [Refs.StackName, "cache"]),
    LifecycleConfiguration: new LifecycleConfiguration({
        Rules: [
            new Rule({
                ExpirationInDays: 30,
                Status: "Enabled"
            })
        ]
    })
});
