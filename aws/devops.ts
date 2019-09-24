import { default as CF } from "cloudform";

import { CodeBuildRole } from "./codeBuild/CodeBuildRole";
import { CodeBuildPolicy } from "./codeBuild/CodeBuildPolicy";
import { CodePipelineRole } from "./codePipeline/CodePipelineRole";
import { CodePipelinePolicy } from "./codePipeline/CodePipelinePolicy";
import { CloudFormationRole } from "./cloudFormation/CloudFormationRole";
import { CloudFormationPolicy } from "./cloudFormation/CloudFormationPolicy";

import { CodeBuildProject } from "./codeBuild/CodeBuildProject";
import { Pipeline } from "./codePipeline/Pipeline";
import { GitHubWebhook } from "./codePipeline/GitHubWebhook";

export default ({ repo, branch }: { repo: string; branch: string }) =>
    CF({
        AWSTemplateFormatVersion: "2010-09-09",
        Description: `${repo}-${branch}-devops`,
        Parameters: {
            GitHubOwner: {
                Description: "GitHub username owning the repo",
                Type: "String",
                Default: "flomio"
            },
            GitHubRepo: {
                Description: "GitHub repo name",
                Type: "String",
                Default: repo
            },
            GitHubBranch: {
                Description: "Repo branch for which pipeline will be built",
                Type: "String",
                Default: branch
            },
            StackName: {
                Description: "Stack for which pipeline will be responsible",
                Type: "String",
                Default: `${repo}-${branch}-api`
            }
        },
        Resources: {
            CodeBuildRole,
            CodePipelineRole,
            CloudFormationRole,
            CodeBuildPolicy: CodeBuildPolicy({ repo, branch }),
            CodePipelinePolicy: CodePipelinePolicy({ repo, branch }),
            CloudFormationPolicy: CloudFormationPolicy({ repo, branch }),
            CodeBuildProject: CodeBuildProject({ repo, branch }),
            Pipeline: Pipeline({ repo, branch }),
            GitHubWebhook
        }
    });
