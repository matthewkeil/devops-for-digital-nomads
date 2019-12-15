"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = __importStar(require("cloudform"));
const lib_1 = require("../lib");
const DomainName_1 = require("./apiGateway/DomainName");
const ServerRecordSet_1 = require("./route53/ServerRecordSet");
const BasePathMapping_1 = require("./apiGateway/BasePathMapping");
const LogGroup_1 = require("./cloudWatch/LogGroup");
const ApiGateway_1 = require("./apiGateway/ApiGateway");
const GatewayResponseDefault4XX_1 = require("./apiGateway/GatewayResponseDefault4XX");
const GatewayResponseDefault5XX_1 = require("./apiGateway/GatewayResponseDefault5XX");
const config_1 = require("../config");
exports.buildServerTemplate = ({ branch, StackName }) => {
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
                Description: "Sub-domain prefix to add to dns records ${SubDomain}.${RootDomain}",
                Type: "String",
                Default: "api"
            },
            BasePath: {
                Description: "BasePathSegment in https://${SubDomain}.${RootDomain}/${BasePath}",
                Type: "String",
                Default: branch === "master" ? "v1" : branch
            }
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore Serverless isn't part of cloudform
        Globals: {
            Api: {
                Cors: {
                    AllowMethods: "'*'",
                    AllowHeaders: "'*'",
                    AllowOrigin: "'*'"
                }
            },
            Function: {
                CodeUri: lib_1.getAbsolutePathFromRootRelativePath("server/dist"),
                Runtime: "nodejs10.x",
                Timeout: 60,
                Environment: {
                    Variables: {
                        DEBUG: process.env.DEBUG,
                        NODE_ENV: "production",
                        ROOT_DOMAIN: config_1.config.ROOT_DOMAIN,
                        REGION: cloudform_1.Refs.Region
                    }
                }
            }
        },
        Resources: {
            BasePathMapping: BasePathMapping_1.BasePathMapping(branch),
            LogGroup: LogGroup_1.LogGroup,
            ApiGateway: ApiGateway_1.ApiGateway,
            GatewayResponseDefault4XX: GatewayResponseDefault4XX_1.GatewayResponseDefault4XX,
            GatewayResponseDefault5XX: GatewayResponseDefault5XX_1.GatewayResponseDefault5XX
        }
    };
    if (branch === "master") {
        template.Resources.RecordSet = ServerRecordSet_1.ServerRecordSet;
        template.Resources.DomainName = DomainName_1.DomainName;
        template.Outputs.DistributionDomainName = {
            Description: "DomainName.DistributionDomainName for api branch RecordSet to reference",
            Value: cloudform_1.Fn.GetAtt("DomainName", "DistributionDomainName"),
            Export: {
                Name: `${lib_1.pascalCaseDomainName(config_1.config.ROOT_DOMAIN)}DistributionDomainName`
            }
        };
        template.Outputs.DistributionHostedZoneId = {
            Description: "DomainName.DistributionHostedZoneId for api branch RecordSet to reference",
            Value: cloudform_1.Fn.GetAtt("DomainName", "DistributionHostedZoneId"),
            Export: {
                Name: `${lib_1.pascalCaseDomainName(config_1.config.ROOT_DOMAIN)}DistributionHostedZoneId`
            }
        };
    }
    // const parseSegment = (segment: Handlers, currentPath: string): void =>
    //     Object.entries(segment).forEach(([name, segmentOrRoute]) => {
    //         if (
    //             segmentOrRoute.handler &&
    //             typeof segmentOrRoute.handler === "function"
    //         ) {
    //             const Name = capitalizeFirstLetter(name);
    //             const handlerDefinition = {
    //                 Type: "AWS::Serverless::Function",
    //                 DependsOn: "PassLedgerTable",
    //                 Properties: {
    //                     FunctionName: `${Name}-${branch}`,
    //                     Handler: `src/${currentPath}/${name}.lambda`,
    //                     Policies: [
    //                         "AmazonDynamoDBFullAccess",
    //                         "SecretsManagerReadWrite",
    //                         "AmazonS3FullAccess",
    //                         {
    //                             "Version": "2012-10-17",
    //                             "Statement": [
    //                                 {
    //                                     "Effect": "Allow",
    //                                     "Action": "ses:*",
    //                                     "Resource": "*"
    //                                 }
    //                             ]
    //                         }
    //                     ],
    //                     Events: {
    //                         [Name]: {
    //                             Type: "Api",
    //                             Properties: {
    //                                 RestApiId: Fn.Ref("ApiGateway"),
    //                                 Path: convertPathToAwsParamStyle(
    //                                     segmentOrRoute.path as string
    //                                 ),
    //                                 Method: segmentOrRoute.method
    //                             }
    //                         }
    //                     }
    //                 }
    //             };
    //             if (segmentOrRoute.auth) {
    //                 (handlerDefinition.Properties.Events[Name]
    //                     .Properties as any).Auth = {
    //                     Authorizer: "PassNinjaCognitoAuthorizer"
    //                 };
    //             }
    //             // @ts-ignore
    //             template.Resources[Name] = handlerDefinition;
    //             return;
    //         }
    //         // recursively parse as a path segment
    //         return parseSegment(segmentOrRoute, `${currentPath}/${name}`);
    //     });
    // const handlers = getHandlers();
    // parseSegment(handlers, "handlers");
    return cloudform_1.default(template);
};
