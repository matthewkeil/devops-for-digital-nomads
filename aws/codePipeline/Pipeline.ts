import { CodePipeline, Fn, Refs } from "cloudform";
import { getArtifactsBucketName } from "../../bin/utils";

export const Pipeline = ({ repo, branch }: { repo: string; branch: string }) =>
    new CodePipeline.Pipeline({
        Name: Fn.Join("-", [Refs.StackName, "pipeline"]),
        RoleArn: Fn.GetAtt("CodePipelineRole", "Arn"),
        ArtifactStore: {
            Type: "S3",
            Location: getArtifactsBucketName({ repo, branch })
        },
        RestartExecutionOnUpdate: true,
        Stages: [
            {
                Name: "Source",
                Actions: [
                    {
                        // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html
                        Name: "Source",
                        // https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#actions-valid-providers
                        ActionTypeId: {
                            Category: "Source",
                            Owner: "ThirdParty",
                            Provider: "GitHub",
                            Version: "1"
                        },
                        // https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html#action-requirements
                        Configuration: {
                            Owner: Fn.Ref("GitHubOwner"),
                            Repo: Fn.Ref("GitHubRepo"),
                            Branch: Fn.Ref("GitHubBranch"),
                            OAuthToken: Fn.Join("", [
                                "{{resolve:secretsmanager:arn:aws:secretsmanager:us-east-1:",
                                "612209380999:secret:ACCESS_TOKENS-sZh1Zp",
                                ":SecretString:GITHUB_OAUTH_TOKEN}}"
                            ]),
                            PollForSourceChanges: false
                        },
                        InputArtifacts: [],
                        OutputArtifacts: [
                            {
                                Name: "SOURCE"
                            }
                        ],
                        RunOrder: 1
                    }
                ]
            },
            {
                Name: "Build",
                Actions: [
                    {
                        Name: "Build",
                        ActionTypeId: {
                            Category: "Build",
                            Owner: "AWS",
                            Provider: "CodeBuild",
                            Version: "1"
                        },
                        Configuration: {
                            ProjectName: Fn.Ref("CodeBuildProject")
                        },
                        InputArtifacts: [
                            {
                                Name: "SOURCE"
                            }
                        ],
                        OutputArtifacts: [
                            {
                                Name: "TEMPLATE"
                            }
                        ],
                        RunOrder: 1
                    }
                ]
            },
            {
                Name: "Staging",
                Actions: [
                    {
                        Name: "Deploy",
                        ActionTypeId: {
                            Category: "Deploy",
                            Owner: "AWS",
                            Provider: "CloudFormation",
                            Version: "1"
                        },
                        Configuration: {
                            ActionMode: "CREATE_UPDATE",
                            StackName: Fn.Ref("StackName"),
                            TemplatePath: "TEMPLATE::cloudformation.yml",
                            Capabilities:
                                "CAPABILITY_AUTO_EXPAND,CAPABILITY_NAMED_IAM",
                            RoleArn: Fn.GetAtt("CloudFormationRole", "Arn"),
                            ParameterOverrides: Fn.Join("", [
                                '{ "GitHubBranch": "',
                                Fn.Ref("GitHubBranch"),
                                '" }'
                            ])
                        },
                        InputArtifacts: [
                            {
                                Name: "TEMPLATE"
                            }
                        ]
                    }
                ]
                // }, {
                //     Name: 'Approval',
                //     Actions: [{
                //         Name: 'Approval',
                //         ActionTypeId: {
                //
                //         }
                //     }]
            }
        ]
    });
