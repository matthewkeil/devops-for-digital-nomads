import { Logs, Fn } from "cloudform";

export const LogGroup = new Logs.LogGroup({
    LogGroupName: Fn.Join("-", [
        "api-gateway-log-group",
        Fn.Ref("GitHubBranch")
    ]),
    RetentionInDays: 30
});
