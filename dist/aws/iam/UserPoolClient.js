"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
exports.UserPoolClient = new cloudform_1.Cognito.UserPoolClient({
    ClientName: "passninja-user-pool-client",
    UserPoolId: cloudform_1.Fn.Ref("UserPool"),
    ExplicitAuthFlows: ["USER_PASSWORD_AUTH"],
    GenerateSecret: false
});
