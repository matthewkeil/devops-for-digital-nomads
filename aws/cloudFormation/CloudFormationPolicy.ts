import { IAM, Fn, Refs } from "cloudform";
import { getArtifactsBucketName } from "../../bin/utils";

export const CloudFormationPolicy = ({
    repo,
    branch
}: {
    repo: string;
    branch: string;
}) =>
    new IAM.Policy({
        Roles: [Fn.Ref("CloudFormationRole")],
        PolicyName: Fn.Join("-", [Refs.StackName, "cloudformation-policy"]),
        PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Action: ["cloudformation:*"],
                    Resource: [
                        Fn.Join("", [
                            "arn:aws:cloudformation:*:",
                            Refs.AccountId,
                            ":stack/",
                            Fn.Ref("StackName"),
                            "/*"
                        ]),
                        "arn:aws:cloudformation:*:aws:transform/Serverless-2016-10-31"
                    ]
                },
                {
                    Effect: "Allow",
                    Action: [
                        "s3:GetObject",
                        "s3:GetObjectVersion",
                        "s3:GetBucketVersioning"
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
                },
                {
                    Effect: "Allow",
                    Action: "ssm:GetParameters",
                    Resource: "*"
                },
                // {
                //     Effect: "Allow",
                //     Action: "lambda:*",
                //     Resource: "*"
                // },
                // {
                //     Effect: "Allow",
                //     Action: "apigateway:*",
                //     Resource: "*"
                // },
                // {
                //     Effect: "Allow",
                //     Action: "cloudfront:*",
                //     Resource: "*"
                // },
                // {
                //     Effect: "Allow",
                //     Action: "route53:*",
                //     Resource: "*"
                // },
                // {
                //     Effect: "Allow",
                //     Action: "logs:*",
                //     Resource: "*"
                // },
                // {
                //     Effect: "Allow",
                //     Action: "dynamoDb:*",
                //     Resource: "*"
                // }
                // TODO: this needs to be broken out above and limited to minimum scope
                {
                    Effect: "Allow",
                    Action: [
                        "iam:*",
                        "lambda:*",
                        "apigateway:*",
                        "cloudfront:*",
                        "route53:*",
                        "logs:*",
                        "dynamoDb:*"
                    ],
                    Resource: "*"
                }
            ]
        }
    });
