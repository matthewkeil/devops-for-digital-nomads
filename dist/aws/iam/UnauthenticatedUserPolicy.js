"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
exports.UnauthenticatedUserPolicy = new cloudform_1.IAM.Policy({
    PolicyName: "passninja-unauthenticated-user-policy",
    Roles: [cloudform_1.Fn.Ref("UnauthenticatedUserRole")],
    PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: "*",
                Resource: "*"
            }
        ]
    }
});
