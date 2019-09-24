import { IAM, Fn, Refs } from "cloudform";

export const CodeBuildRole = new IAM.Role({
    RoleName: Fn.Join("-", [Refs.StackName, "code-build-role"]),
    AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: "sts:AssumeRole",
                Principal: {
                    Service: "codebuild.amazonaws.com"
                }
            }
        ]
    }
});
