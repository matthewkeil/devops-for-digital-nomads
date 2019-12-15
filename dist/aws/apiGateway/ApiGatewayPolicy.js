"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
exports.ApiGatewayPolicy = new cloudform_1.IAM.Policy({
    Roles: [cloudform_1.Fn.Ref("ApiGatewayRole")],
    PolicyName: `ApiGatewayPolicy`,
    PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: "logs:*",
                Resource: "*"
            }
        ]
    }
}).dependsOn("ApiGatewayRole");
