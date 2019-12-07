import { default as CF, Fn, Refs } from "cloudform";
import {
    pascalCaseDomainName,
    getAbsolutePathFromRootRelativePath,
    convertPathToAwsParamStyle
} from "../lib/utils";

import { DomainName } from "./apiGateway/DomainName";
import { ServerRecordSet } from "./route53/ServerRecordSet";
import { BasePathMapping } from "./apiGateway/BasePathMapping";
import { LogGroup } from "./cloudWatch/LogGroup";
import { ApiGateway } from "./apiGateway/ApiGateway";
import { GatewayResponseDefault4XX } from "./apiGateway/GatewayResponseDefault4XX";
import { GatewayResponseDefault5XX } from "./apiGateway/GatewayResponseDefault5XX";
import { getHandlers, Handlers } from "../server/src/utils";
import { config } from "../config";
import { capitalizeFirstLetter } from "../lib/utils";

interface TemplateParams {
    branch: string;
    StackName: string;
}

export const buildServerTemplate = ({ branch, StackName }: TemplateParams) => {
    const template = {
        AWSTemplateFormatVersion: "2010-09-09",
        Description: StackName,
        Transform: "AWS::Serverless-2016-10-31",
        Parameters: {
            GitHubBranch: {
                Description: "Github branch to deploy",
                Type: "String",
                Default: branch
            },
            SubDomain: {
                Description:
                    "Sub-domain prefix to add to dns records ${SubDomain}.${RootDomain}",
                Type: "String",
                Default: "api"
            },
            BasePath: {
                Description:
                    "BasePathSegment in https://${SubDomain}.${RootDomain}/${BasePath}",
                Type: "String",
                Default: branch === "master" ? "v1" : branch
            }
        },
        // @ts-ignore
        Globals: {
            Api: {
                Cors: {
                    AllowMethods: "'*'",
                    AllowHeaders: "'*'",
                    AllowOrigin: "'*'"
                }
            },
            Function: {
                CodeUri: getAbsolutePathFromRootRelativePath("server/dist"),
                Runtime: "nodejs10.x",
                Timeout: 60,
                Environment: {
                    Variables: {
                        DEBUG: process.env.DEBUG,
                        NODE_ENV: "production",
                        ROOT_DOMAIN: config.ROOT_DOMAIN,
                        REGION: Refs.Region
                    }
                }
            }
        },
        Resources: {
            BasePathMapping: BasePathMapping(branch),
            LogGroup,
            ApiGateway,
            GatewayResponseDefault4XX,
            GatewayResponseDefault5XX
        }
    };

    if (branch === "master") {
        (template.Resources as any).RecordSet = ServerRecordSet;
        (template.Resources as any).DomainName = DomainName;

        (template as any).Outputs.DistributionDomainName = {
            Description:
                "DomainName.DistributionDomainName for api branch RecordSet to reference",
            Value: Fn.GetAtt("DomainName", "DistributionDomainName"),
            Export: {
                Name: `${pascalCaseDomainName(
                    config.ROOT_DOMAIN
                )}DistributionDomainName`
            }
        };

        (template as any).Outputs.DistributionHostedZoneId = {
            Description:
                "DomainName.DistributionHostedZoneId for api branch RecordSet to reference",
            Value: Fn.GetAtt("DomainName", "DistributionHostedZoneId"),
            Export: {
                Name: `${pascalCaseDomainName(
                    config.ROOT_DOMAIN
                )}DistributionHostedZoneId`
            }
        };
    }

    const parseSegment = (segment: Handlers, currentPath: string): void =>
        Object.entries(segment).forEach(([name, segmentOrRoute]) => {
            if (
                segmentOrRoute.handler &&
                typeof segmentOrRoute.handler === "function"
            ) {
                const Name = capitalizeFirstLetter(name);

                const handlerDefinition = {
                    Type: "AWS::Serverless::Function",
                    DependsOn: "PassLedgerTable",
                    Properties: {
                        FunctionName: `${Name}-${branch}`,
                        Handler: `src/${currentPath}/${name}.lambda`,
                        Policies: [
                            "AmazonDynamoDBFullAccess",
                            "SecretsManagerReadWrite",
                            "AmazonS3FullAccess",
                            {
                                "Version": "2012-10-17",
                                "Statement": [
                                    {
                                        "Effect": "Allow",
                                        "Action": "ses:*",
                                        "Resource": "*"
                                    }
                                ]
                            }
                        ],
                        Events: {
                            [Name]: {
                                Type: "Api",
                                Properties: {
                                    RestApiId: Fn.Ref("ApiGateway"),
                                    Path: convertPathToAwsParamStyle(
                                        segmentOrRoute.path as string
                                    ),
                                    Method: segmentOrRoute.method
                                }
                            }
                        }
                    }
                };

                if (segmentOrRoute.auth) {
                    (handlerDefinition.Properties.Events[Name]
                        .Properties as any).Auth = {
                        Authorizer: "PassNinjaCognitoAuthorizer"
                    };
                }

                // @ts-ignore
                template.Resources[Name] = handlerDefinition;

                return;
            }

            // recursively parse as a path segment
            return parseSegment(segmentOrRoute, `${currentPath}/${name}`);
        });

    const handlers = getHandlers();

    parseSegment(handlers, "handlers");

    return CF(template);
};
