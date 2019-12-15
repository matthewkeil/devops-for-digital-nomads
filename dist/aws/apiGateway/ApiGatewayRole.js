"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
exports.ApiGatewayRole = new cloudform_1.IAM.Role({
    RoleName: `ApiGatewayRole`,
    AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: "sts:AssumeRole",
                Principal: {
                    Service: "apigateway.amazonaws.com"
                }
            }
        ]
    }
});
