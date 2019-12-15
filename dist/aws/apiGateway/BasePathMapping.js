"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
const config_1 = require("../../config");
exports.BasePathMapping = (branch) => {
    const basePathMapping = new cloudform_1.ApiGateway.BasePathMapping({
        RestApiId: cloudform_1.Fn.Ref("ApiGateway"),
        DomainName: cloudform_1.Fn.Join(".", [cloudform_1.Fn.Ref("SubDomain"), config_1.config.ROOT_DOMAIN]),
        BasePath: cloudform_1.Fn.Ref("BasePath"),
        Stage: cloudform_1.Fn.Ref("GitHubBranch")
    });
    if (branch === "master") {
        basePathMapping.dependsOn("DomainName");
    }
    else {
        basePathMapping.dependsOn("ApiGatewayStage");
    }
    return basePathMapping;
};
