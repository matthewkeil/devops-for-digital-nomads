import { Fn } from "cloudform";
import { config } from "../config";
import { pascalCaseDomainName } from "../bin";

import { HostedZone } from "./route53/HostedZone";
import { ApiGatewayAccount } from "./apiGateway/ApiGatewayAccount";
import { ApiGatewayPolicy } from "./apiGateway/ApiGatewayPolicy";
import { ApiGatewayRole } from "./apiGateway/ApiGatewayRole";

export const coreTemplate = {
    Description: `core-${pascalCaseDomainName(config.ROOT_DOMAIN)}`,
    Parameters: {
        RootDomain: {
            Description: "Root domain at which the system is hosted.",
            Type: "String",
            Default: config.ROOT_DOMAIN
        }
    },
    Resources: {
        ApiGatewayAccount,
        ApiGatewayPolicy,
        ApiGatewayRole,
        HostedZone
    },
    Outputs: {
        HostedZoneId: {
            Description: `HostedZoneId for ${config.ROOT_DOMAIN}`,
            Value: Fn.Ref("HostedZone"),
            Export: {
                Name: `${pascalCaseDomainName(config.ROOT_DOMAIN)}HostedZone`
            }
        }
    }
};
