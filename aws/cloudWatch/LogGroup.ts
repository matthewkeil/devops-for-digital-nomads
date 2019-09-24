import { Logs, Fn } from "cloudform";

export const LogGroup = new Logs.LogGroup({
    LogGroupName: Fn.Join("-", [
        "api-gateway",
        Fn.Ref("GitHubBranch"),
        "log-group"
    ]),
    RetentionInDays: 30
});
