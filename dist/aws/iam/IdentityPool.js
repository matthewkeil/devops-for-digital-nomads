"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
exports.IdentityPool = new cloudform_1.Cognito.IdentityPool({
    IdentityPoolName: "PassNinjaIdentityPool",
    AllowUnauthenticatedIdentities: true,
    DeveloperProviderName: "passninja.com",
    CognitoIdentityProviders: [
        {
            ClientId: cloudform_1.Fn.Ref("UserPoolClient"),
            ServerSideTokenCheck: false,
            ProviderName: cloudform_1.Fn.Join("", [
                "cognito-idp.",
                cloudform_1.Refs.Region,
                ".amazonaws.com/",
                cloudform_1.Fn.Ref("UserPool")
            ])
        }
    ]
});
