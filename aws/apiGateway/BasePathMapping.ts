import { ApiGateway, Fn } from "cloudform";
import { config } from "@config";

export const BasePathMapping = (branch: string) => {
    const basePathMapping = new ApiGateway.BasePathMapping({
        RestApiId: Fn.Ref("ApiGateway"),
        DomainName: Fn.Join(".", [Fn.Ref("SubDomain"), config.ROOT_DOMAIN]),
        BasePath: Fn.Ref("BasePath"),
        Stage: Fn.Ref("GitHubBranch")
    });

    if (branch === "master") {
        basePathMapping.dependsOn("DomainName");
    } else {
        basePathMapping.dependsOn("ApiGatewayStage");
    }

    return basePathMapping;
};
