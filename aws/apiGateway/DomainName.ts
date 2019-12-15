import { ApiGateway, Fn } from "cloudform";

export const DomainName = new ApiGateway.DomainName({
    DomainName: Fn.Join(".", [Fn.Ref("SubDomain"), Fn.ImportValue("RootDomain")]),
    CertificateArn: Fn.ImportValue("Certificate")
}).dependsOn("ApiGateway");
