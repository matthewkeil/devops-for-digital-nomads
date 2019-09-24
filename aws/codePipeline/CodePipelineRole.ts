import { IAM, Fn, Refs } from "cloudform";

export const CodePipelineRole = new IAM.Role({
    RoleName: Fn.Join("-", [Refs.StackName, "code-pipeline-role"]),
    AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: "sts:AssumeRole",
                Principal: {
                    Service: "codepipeline.amazonaws.com"
                }
            }
        ]
    }
});
