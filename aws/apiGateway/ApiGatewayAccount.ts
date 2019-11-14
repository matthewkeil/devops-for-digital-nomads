import { ApiGateway, Fn } from "cloudform";

export const ApiGatewayAccount = new ApiGateway.Account({
    CloudWatchRoleArn: Fn.GetAtt("ApiGatewayRole", "Arn")
}).dependsOn("ApiGatewayPolicy");
