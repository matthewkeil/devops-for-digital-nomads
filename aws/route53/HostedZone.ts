import { Route53, Fn } from "cloudform";

export const HostedZone = new Route53.HostedZone({
    Name: Fn.Ref("RootDomain"),
    HostedZoneConfig: {
        Comment: Fn.Join(" ", [`hosted zone for`, Fn.Ref("RootDomain")])
    }
});
