import { IAM, Fn } from "cloudform";

export const CustomerPolicy = new IAM.ManagedPolicy({
    ManagedPolicyName: "passninja-customer-policy",
    Roles: [Fn.Ref("CustomerRole")],
    PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: "*",
                Resource: "*"
                //     'iot:ListPrincipalThings',
                //     'iot:Connect',
                //     'iot:Publish',
                //     'iot:Subscribe',
                //     'iot:Receive',
            }
        ]
    }
});

// {
//   Effect: 'Allow',
//   Action: [
//     'cognito-identity:GetId',
//     'iot:DescribeEndpoint',
//     'iot:DescribeThing',
//     'iot:CreateThing',
//     'iot:UpdateThing',
//     'iot:DeleteThing',
//     'iot:AttachPrincipalPolicy',
//     'iot:AttachThingPrincipal',
//     'iot:DetachThingPrincipal',
//     'iot:GetThingShadow',
//     'iot:UpdateThingShadow',
//     'iot:DeleteThingShadow'
//   ],
//   Resource: '*'
// }
// Resource: Fn.Sub(
//   'arn:aws:iot:::thing/${!cognito-identity.amazonaws.com:sub}:*',
//   {}
// )

// Condition: {
//   ArnEquals: {
//     'iot:ThingArn': Fn.Sub(
//       'arn:aws:iot:*:448311138761:thing/${!cognito-identity.amazonaws.com:sub}:*',
//       {}
//     )
//   }
// }
// {
//   Effect: 'Allow',
//   Action: ['iot:AttachThingPrincipal', 'iot:DetachThingPrincipal'],
// Resource: '*',
// Condition: {
//   ArnEquals: {
//     'iot:ThingArn': Fn.Sub(
//       'arn:aws:iot:*:448311138761:thing/${!cognito-identity.amazonaws.com:sub}:passninja-cli:*',
//       {}
//     )
//   }
// }
// }
// {
//   Effect: 'Allow',
// Action: [
//   ],
//   Resource: '*'
// },
// {
//   Effect: 'Allow',
//   Action: 'iot:AttachPrincipalPolicy',
//   Resource: '*'

// Condition: {
//   ArnEquals: {
//     'iot:PolicyArn': Fn.Join('', [
//       'arn:aws:iot:*:448311138761:policy/',
//       Refs.StackName,
//       '/',
//       'cognitos-own'
//     ])
//   }
// }
