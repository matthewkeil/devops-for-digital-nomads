"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
exports.LogGroup = new cloudform_1.Logs.LogGroup({
    LogGroupName: cloudform_1.Fn.Join("-", ["api-gateway-log-group", cloudform_1.Fn.Ref("GitHubBranch")]),
    RetentionInDays: 30
});
