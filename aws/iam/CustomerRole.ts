import { IAM, Fn } from "cloudform";

export const CustomerRole = new IAM.Role({
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
                        "cognito-identity.amazonaws.com:aud": Fn.ImportValue(
                            "IdentityPoolId"
                        )
                    },
                    "ForAnyValue:StringLike": {
                        "cognito-identity.amazonaws.com:amr": "authenticated"
                    }
                }
            }
        ]
    }
});
