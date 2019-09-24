import { CodeBuild, Fn, Refs } from "cloudform";
import { getArtifactsBucketName } from "../../bin/utils";

export const CodeBuildProject = ({
    repo,
    branch
}: {
    repo: string;
    branch: string;
}) =>
    new CodeBuild.Project({
        Name: Fn.Join("-", [Refs.StackName, "code-build-project"]),
        Description: Fn.Join(" ", ["CodeBuild Project for", Refs.StackName]),
        ServiceRole: Fn.Ref("CodeBuildRole"),
        Source: {
            Type: "CODEPIPELINE"
        },
        // Cache: new CodeBuild.Project.ProjectCache({
        //     Location: Fn.Ref("CacheBucket"),
        //     Type: "S3"
        // }),
        Artifacts: {
            Type: "CODEPIPELINE",
            OverrideArtifactName: true
        },
        Environment: {
            ComputeType: "BUILD_GENERAL1_SMALL",
            Image: "aws/codebuild/standard:2.0",
            Type: "LINUX_CONTAINER",
            EnvironmentVariables: [
                {
                    Name: "BRANCH",
                    Type: "PLAINTEXT",
                    Value: Fn.Ref("GitHubBranch")
                },
                // {
                //     Name: "CACHE_BUCKET",
                //     Type: "PLAINTEXT",
                //     Value: Fn.Ref("CacheBucket")
                // },
                {
                    Name: "ARTIFACTS_BUCKET",
                    Type: "PLAINTEXT",
                    Value: getArtifactsBucketName({ repo, branch })
                }
            ]
        }
    });
