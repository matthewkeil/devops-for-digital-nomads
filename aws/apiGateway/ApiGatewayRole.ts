import { IAM } from "cloudform";
import { pascalCaseDomainName } from "../../bin";
import { config } from "../../config";

export const ApiGatewayRole = new IAM.Role({
    RoleName: `${pascalCaseDomainName(config.ROOT_DOMAIN)}ApiGatewayRole`,
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
