"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
exports.ApiGateway = {
    Type: "AWS::Serverless::Api",
    Properties: {
        EndpointConfiguration: "EDGE",
        StageName: cloudform_1.Fn.Ref("GitHubBranch"),
        // Auth: {
        //     Authorizers: {
        //         PassNinjaCognitoAuthorizer: {
        //             UserPoolArn: Fn.ImportValue("UserPoolArn")
        //         }
        //     }
        // },
        MethodSettings: [
            {
                ResourcePath: "/*",
                HttpMethod: "*",
                LoggingLevel: "INFO",
                DataTraceEnabled: true,
                MetricsEnabled: true,
                CachingEnabled: false
                // CacheTtlInSeconds : 'Integer',
                // CacheDataEncrypted : 'Boolean',
                // ThrottlingBurstLimit: 'Integer',
                // ThrottlingRateLimit: 'Double'
            }
        ],
        AccessLogSetting: {
            DestinationArn: cloudform_1.Fn.GetAtt("LogGroup", "Arn"),
            Format: '{ "requestId": "$context.requestId", "requestTime": "$context.requestTime", "ip": "$context.identity.sourceIp", "apiKey": "$context.identity.apiKey", "apiKeyId": "$context.identity.apiKeyId", "path": "$context.path", "httpMethod": "$context.httpMethod", "resourcePath": "$context.resourcePath", "errorMessage": "$context.error.message", "params": $input.params()}'
        }
    }
};
