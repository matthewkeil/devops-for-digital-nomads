import { IAM, Fn, Refs } from "cloudform";

export const CloudFormationRole = new IAM.Role({
    RoleName: Fn.Join("-", [Refs.StackName, "cloudformation-role"]),
    AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: "sts:AssumeRole",
                Principal: {
                    Service: "cloudformation.amazonaws.com"
                }
            }
        ]
    }
});
