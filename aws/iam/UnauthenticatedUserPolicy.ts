import { IAM, Fn } from "cloudform";

export const UnauthenticatedUserPolicy = new IAM.Policy({
    PolicyName: "passninja-unauthenticated-user-policy",
    Roles: [Fn.Ref("UnauthenticatedUserRole")],
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
