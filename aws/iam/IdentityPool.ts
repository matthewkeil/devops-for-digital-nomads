import { Cognito, Fn, Refs } from "cloudform";

export const IdentityPool = new Cognito.IdentityPool({
    IdentityPoolName: "PassNinjaIdentityPool",
    AllowUnauthenticatedIdentities: true,
    DeveloperProviderName: "passninja.com",
    CognitoIdentityProviders: [
        {
            ClientId: Fn.Ref("UserPoolClient"),
            ServerSideTokenCheck: false,
            ProviderName: Fn.Join("", [
                "cognito-idp.",
                Refs.Region,
                ".amazonaws.com/",
                Fn.Ref("UserPool")
            ])
        }
    ]
});
