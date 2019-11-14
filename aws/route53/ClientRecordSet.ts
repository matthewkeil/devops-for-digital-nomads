import { Route53, Fn } from "cloudform";
import { config } from "../../config";
import { pascalCaseDomainName } from "../../bin";

export const ClientRecordSet = new Route53.RecordSet({
    Name: Fn.Join(".", [Fn.Ref("SubDomain"), config.ROOT_DOMAIN]),
    Type: "A",
    HostedZoneId: Fn.ImportValue(
        `${pascalCaseDomainName(config.ROOT_DOMAIN)}HostedZone`
    ),
    AliasTarget: {
        DNSName: Fn.GetAtt("ClientDistribution", "DomainName"),
        HostedZoneId: "Z2FDTNDATAQYW2"
    }
}).dependsOn("ClientDistribution");
