import { Route53, Fn } from "cloudform";

export const RecordSet = new Route53.RecordSet({
    Name: Fn.Join(".", [Fn.Ref("SubDomain"), Fn.ImportValue("RootDomain")]),
    Type: "A",
    HostedZoneId: Fn.ImportValue("HostedZoneId"),
    AliasTarget: {
        DNSName: Fn.GetAtt("DomainName", "DistributionDomainName"),
        HostedZoneId: Fn.GetAtt("DomainName", "DistributionHostedZoneId")
    }
}).dependsOn("DomainName");
