"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
exports.CustomerRole = new cloudform_1.IAM.Role({
    RoleName: "passninja-customer-role",
    AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Principal: {
                    Federated: "cognito-identity.amazonaws.com"
                },
                Action: "sts:AssumeRoleWithWebIdentity",
                Condition: {
                    StringEquals: {
                        "cognito-identity.amazonaws.com:aud": cloudform_1.Fn.ImportValue("IdentityPoolId")
                    },
                    "ForAnyValue:StringLike": {
                        "cognito-identity.amazonaws.com:amr": "authenticated"
                    }
                }
            }
        ]
    }
});
