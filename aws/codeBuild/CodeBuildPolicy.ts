import { IAM, Fn, Refs } from "cloudform";
import { getArtifactsBucketName } from "../../bin/utils";

export const CodeBuildPolicy = ({
    repo,
    branch
}: {
    repo: string;
    branch: string;
}) =>
    new IAM.Policy({
        PolicyName: Fn.Join("-", [Refs.StackName, "code-build-policy"]),
        Roles: [Fn.Ref("CodeBuildRole")],
        PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Action: [
                        "kms:GenerateDataKey*",
                        "kms:Encrypt",
                        "kms:Decrypt"
                    ],
                    Resource: Fn.Sub(
                        "arn:aws:kms::${AWS::AccountId}:alias/aws/s3",
                        {}
                    )
                },
                {
                    Effect: "Allow",
                    Action: [
                        "logs:CreateLogGroup",
                        "logs:CreateLogStream",
                        "logs:PutLogEvents"
                    ],
                    Resource: "*"
                },
                {
                    Effect: "Allow",
                    Action: "ssm:GetParameters",
                    Resource: "*"
                },
                {
                    Effect: "Allow",
                    Action: [
                        "s3:GetObject",
                        "s3:GetObjectVersion",
                        "s3:GetBucketVersioning",
                        "s3:PutObject"
                    ],
                    Resource: [
                        `arn:aws:s3:::${getArtifactsBucketName({
                            repo,
                            branch
                        })}`,
                        `arn:aws:s3:::${getArtifactsBucketName({
                            repo,
                            branch
                        })}/*`
                    ]
                }
            ]
        }
    });
