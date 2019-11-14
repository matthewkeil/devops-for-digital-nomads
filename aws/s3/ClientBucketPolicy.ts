import { S3, Fn } from "cloudform";

export const ClientBucketPolicy = new S3.BucketPolicy({
    Bucket: Fn.Ref("ClientBucket"),
    PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "Allow CloudFront read access",
                Effect: "Allow",
                Action: "s3:GetObject",
                Resource: Fn.Join("", [Fn.GetAtt("ClientBucket", "Arn"), "/*"]),
                Principal: {
                    CanonicalUser: Fn.GetAtt(
                        "ClientOriginAccessIdentity",
                        "S3CanonicalUserId"
                    )
                }
            }
        ]
    }
}).dependsOn("ClientOriginAccessIdentity");
