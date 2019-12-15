"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
exports.UserPool = new cloudform_1.Cognito.UserPool({
    UserPoolName: "passninja-user-pool",
    AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: true,
        UnusedAccountValidityDays: 7
        // InviteMessageTemplate: {
        //   EmailMessage: 'replace me as the body of the invite message',
        //   EmailSubject: 'PassNinja Administrator Account Invitation'
        // }
    },
    EmailConfiguration: {
        ReplyToEmailAddress: "info@passninja.com"
    },
    DeviceConfiguration: {
        ChallengeRequiredOnNewDevice: false,
        DeviceOnlyRememberedOnUserPrompt: true
    },
    UsernameAttributes: ["email"],
    AutoVerifiedAttributes: ["email"],
    Policies: {
        PasswordPolicy: {
            MinimumLength: 8,
            RequireLowercase: true,
            RequireSymbols: true,
            RequireUppercase: true,
            RequireNumbers: true
        }
    }
});
