import { Cognito, Fn } from "cloudform";

export const IdentityPoolRoleAttachment = new Cognito.IdentityPoolRoleAttachment(
    {
        IdentityPoolId: Fn.ImportValue("IdentityPoolId"),
        Roles: {
            authenticated: Fn.GetAtt("CustomerRole", "Arn"),
            unauthenticated: Fn.GetAtt("UnauthenticatedUserRole", "Arn")
        }
    }
);
