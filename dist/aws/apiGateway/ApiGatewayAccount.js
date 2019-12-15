"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
exports.ApiGatewayAccount = new cloudform_1.ApiGateway.Account({
    CloudWatchRoleArn: cloudform_1.Fn.GetAtt("ApiGatewayRole", "Arn")
}).dependsOn("ApiGatewayPolicy");
