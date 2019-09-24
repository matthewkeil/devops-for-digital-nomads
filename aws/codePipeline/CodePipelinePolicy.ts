import { IAM, Fn, Refs } from "cloudform";
import { getArtifactsBucketName } from "../../bin/utils";

export const CodePipelinePolicy = ({
    repo,
    branch
}: {
    repo: string;
    branch: string;
}) =>
    new IAM.Policy({
        PolicyName: Fn.Join("-", [Refs.StackName, "code-pipeline-policy"]),
        Roles: [Fn.Ref("CodePipelineRole")],
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
                        "codebuild:StartBuild",
                        "codebuild:BatchGetBuilds",
                        "codebuild:StopBuild"
                    ],
                    Resource: Fn.GetAtt("CodeBuildProject", "Arn")
                },
                {
                    Effect: "Allow",
                    Action: "iam:PassRole",
                    Resource: Fn.GetAtt("CloudFormationRole", "Arn")
                },
                {
                    Effect: "Allow",
                    Action: "cloudformation:*",
                    Resource: Fn.Join("", [
                        "arn:aws:cloudformation:*:",
                        Refs.AccountId,
                        ":stack/",
                        Fn.Ref("StackName"),
                        "/*"
                    ])
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
