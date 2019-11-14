import { Cognito, Fn } from "cloudform";

export const UserPoolClient = new Cognito.UserPoolClient({
    ClientName: "passninja-user-pool-client",
    UserPoolId: Fn.Ref("UserPool"),
    ExplicitAuthFlows: ["USER_PASSWORD_AUTH"],
    GenerateSecret: false
});
