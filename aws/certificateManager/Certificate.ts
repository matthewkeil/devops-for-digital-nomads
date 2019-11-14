import { CertificateManager, Fn } from "cloudform";

export const Certificate = new CertificateManager.Certificate({
    DomainName: Fn.Ref("RootDomain"),
    SubjectAlternativeNames: [Fn.Join(".", ["*", Fn.Ref("RootDomain")])],
    ValidationMethod: "DNS"
});
