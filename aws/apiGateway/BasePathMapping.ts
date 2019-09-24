import { ApiGateway, Fn } from "cloudform";

export const BasePathMapping = new ApiGateway.BasePathMapping({
    RestApiId: Fn.Ref("ApiGateway"),
    DomainName: Fn.Join(".", [
        Fn.Ref("SubDomain"),
        Fn.ImportValue("RootDomain")
    ]),
    BasePath: Fn.Ref("BasePath"),
    Stage: Fn.Ref("GitHubBranch")
}).dependsOn("DomainName");
