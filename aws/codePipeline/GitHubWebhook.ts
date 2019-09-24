import { CodePipeline, Fn, Refs } from "cloudform";

export const GitHubWebhook = new CodePipeline.Webhook({
    Name: Fn.Join("-", [Refs.StackName, "github-webhook"]),
    TargetPipeline: Fn.Ref("Pipeline"),
    TargetPipelineVersion: Fn.GetAtt("Pipeline", "Version"),
    TargetAction: "Source",
    Authentication: "GITHUB_HMAC",
    RegisterWithThirdParty: true,
    Filters: [
        {
            JsonPath: "$.ref",
            MatchEquals: "refs/heads/{Branch}"
        }
    ],
    AuthenticationConfiguration: {
        SecretToken: Fn.Join("", [
            "{{resolve:secretsmanager:arn:aws:secretsmanager:us-east-1:",
            "612209380999:secret:ACCESS_TOKENS-sZh1Zp",
            ":SecretString:GITHUB_OAUTH_TOKEN}}"
        ])
    }
});
