import { IAM, Fn } from "cloudform";
import { pascalCaseDomainName } from "../../bin";
import { config } from "../../config";

export const ApiGatewayPolicy = new IAM.Policy({
    Roles: [Fn.Ref("ApiGatewayRole")],
    PolicyName: `${pascalCaseDomainName(config.ROOT_DOMAIN)}ApiGatewayPolicy`,
    PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: "logs:*",
                Resource: "*"
            }
        ]
    }
}).dependsOn("ApiGatewayRole");
