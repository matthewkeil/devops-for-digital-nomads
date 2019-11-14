import { IAM } from "cloudform";

export const ApiGatewayRole = new IAM.Role({
    RoleName: `ApiGatewayRole`,
    AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: "sts:AssumeRole",
                Principal: {
                    Service: "apigateway.amazonaws.com"
                }
            }
        ]
    }
});
