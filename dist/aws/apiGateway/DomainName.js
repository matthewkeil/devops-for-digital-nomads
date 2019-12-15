"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
exports.DomainName = new cloudform_1.ApiGateway.DomainName({
    DomainName: cloudform_1.Fn.Join(".", [
        cloudform_1.Fn.Ref("SubDomain"),
        cloudform_1.Fn.ImportValue("RootDomain")
    ]),
    CertificateArn: cloudform_1.Fn.ImportValue("Certificate")
}).dependsOn("ApiGateway");
