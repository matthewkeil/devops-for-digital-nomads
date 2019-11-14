import { Fn } from "cloudform";
import { config } from "../config";
import { pascalCaseDomainName, apiGatewayAccountExists } from "../bin";

import { HostedZone } from "./route53/HostedZone";
import { ApiGatewayAccount } from "./apiGateway/ApiGatewayAccount";
import { ApiGatewayPolicy } from "./apiGateway/ApiGatewayPolicy";
import { ApiGatewayRole } from "./apiGateway/ApiGatewayRole";
import { Certificate } from "../aws/certificateManager/Certificate";

export const buildCoreTemplate = async (deployCert: boolean) => {
    const template = {
        Description: `core-${pascalCaseDomainName(config.ROOT_DOMAIN)}`,
        Parameters: {
            RootDomain: {
                Description: "Root domain at which the system is hosted.",
                Type: "String",
                Default: config.ROOT_DOMAIN
            }
        },
        Resources: {
            HostedZone
        },
        Outputs: {
            HostedZoneId: {
                Description: `HostedZoneId for ${config.ROOT_DOMAIN}`,
                Value: Fn.Ref("HostedZone"),
                Export: {
                    Name: `${pascalCaseDomainName(
                        config.ROOT_DOMAIN
                    )}HostedZone`
                }
            }
        }
    };

    if (!(await apiGatewayAccountExists())) {
        (template.Resources as any).ApiGatewayAccount = ApiGatewayAccount;
        (template.Resources as any).ApiGatewayPolicy = ApiGatewayPolicy;
        (template.Resources as any).ApiGatewayRole = ApiGatewayRole;
    }

    if (deployCert) {
        (template.Resources as any).Certificate = Certificate;
        (template.Outputs as any).Certificate = {
            Description: `SSL Certificate covering *.${config.ROOT_DOMAIN}`,
            Value: Fn.Ref("Certificate"),
            Export: {
                Name: `${pascalCaseDomainName(config.ROOT_DOMAIN)}Certificate`
            }
        };
    }

    return template;
};
