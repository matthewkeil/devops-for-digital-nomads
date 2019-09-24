import { S3, Fn } from "cloudform";

const Resource = [
    Fn.GetAtt("CacheBucket", "Arn"),
    Fn.Join("", [Fn.GetAtt("CacheBucket", "Arn"), "/*"])
];

export const CacheBucketPolicy = new S3.BucketPolicy({
    Bucket: Fn.Ref("CacheBucket"),
    PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "Allow CI/CD read access",
                Effect: "Allow",
                Action: [
                    "s3:GetObject",
                    "s3:GetObjectVersion",
                    "s3:GetBucketVersioning"
                ],
                Resource,
                Principal: {
                    AWS: [
                        Fn.GetAtt("CloudFormationRole", "Arn"),
                        Fn.GetAtt("CodePipelineRole", "Arn"),
                        Fn.GetAtt("CodeBuildRole", "Arn")
                    ]
                }
            },
            {
                Sid: "Allow CI/CD write access",
                Effect: "Allow",
                Action: ["s3:PutObject"],
                Resource,
                Principal: {
                    AWS: [
                        Fn.GetAtt("CodePipelineRole", "Arn"),
                        Fn.GetAtt("CodeBuildRole", "Arn")
                    ]
                }
            }
        ]
    }
});
