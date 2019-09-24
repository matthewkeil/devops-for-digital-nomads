import { default as CF, Fn, Refs } from "cloudform";
import {
    capitalizeFirstLetter,
    convertPathToAwsParamStyle
} from "../bin/utils";

import { PassLedgerTable } from "./dynamo/PassLedgerTable";
import { DomainName } from "./apiGateway/DomainName";
import { RecordSet } from "./route53/RecordSet";
import { BasePathMapping } from "./apiGateway/BasePathMapping";
import { LogGroup } from "./cloudWatch/LogGroup";
import { ApiGateway } from "./apiGateway/ApiGateway";
import { GatewayResponseDefaul4XX } from "./apiGateway/GatewayResponseDefaul4XX";
import { GatewayResponseDefaul5XX } from "./apiGateway/GatewayResponseDefaul5XX";
import { getHandlers, Handlers } from "../src/utils/buildHandlers";

export default (branch: string) => {
    const template = {
        AWSTemplateFormatVersion: "2010-09-09",
        Description: `passninja-api-${branch}-api`,
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
                Description: "BasePathSegment api.passninja.com/${BasePath}",
                Type: "String",
                Default: branch === "master" ? "v1" : branch
            }
        },
        // @ts-ignore
        Globals: {
            Api: {
                // Auth:
                // Name:
                // DefinitionUri:
                // CacheClusterEnabled:
                // CacheClusterSize:
                // Variables:
                // EndpointConfiguration:
                // MethodSettings:
                // BinaryMediaTypes:
                // MinimumCompressionSize:
                Cors: {
                    AllowMethods: "'*'",
                    AllowHeaders: "'*'",
                    AllowOrigin: "'*'"
                }
                // GatewayResponses:
                // AccessLogSetting:
                // CanarySetting:
                // TracingEnabled:
                // OpenApiVersion:
            },
            Function: {
                CodeUri: "../dist",
                Runtime: "nodejs10.x",
                Timeout: 60,
                Environment: {
                    Variables: {
                        REGION: Refs.Region,
                        DB_CLUSTER_ADDRESS: "",
                        DB_PORT: 3306,
                        DB_NAME: "",
                        DB_USERNAME: "",
                        DB_PASSWORD: "",
                        DYNAMO_TABLE_NAME: Fn.Ref("PassLedgerTable")
                    }
                }
            }
        },
        Resources: {
            PassLedgerTable: PassLedgerTable(branch),
            DomainName,
            BasePathMapping,
            RecordSet,
            LogGroup,
            ApiGateway,
            GatewayResponseDefaul4XX,
            GatewayResponseDefaul5XX
        },
        Outputs: {
            PassLedgerTableStreamArn: {
                Description: `Arn of DynamoDBStream associated with ${
                    PassLedgerTable(branch).Properties.TableName
                }`,
                Value: Fn.GetAtt("PassLedgerTable", "StreamArn"),
                Export: {
                    Name: `PassLedger${capitalizeFirstLetter(
                        branch
                    )}TableStreamArn`
                }
            }
        }
    };

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
                        Handler: `${currentPath}/${name}.lambda`,
                        Policies: [
                            "AmazonDynamoDBFullAccess",
                            "SecretsManagerReadWrite"
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
