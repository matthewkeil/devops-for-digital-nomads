"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
exports.IdentityPoolRoleAttachment = new cloudform_1.Cognito.IdentityPoolRoleAttachment({
    IdentityPoolId: cloudform_1.Fn.ImportValue("IdentityPoolId"),
    Roles: {
        authenticated: cloudform_1.Fn.GetAtt("CustomerRole", "Arn"),
        unauthenticated: cloudform_1.Fn.GetAtt("UnauthenticatedUserRole", "Arn")
    }
});
