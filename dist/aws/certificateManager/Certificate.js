"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
exports.Certificate = new cloudform_1.CertificateManager.Certificate({
    DomainName: cloudform_1.Fn.Ref("RootDomain"),
    SubjectAlternativeNames: [cloudform_1.Fn.Join(".", ["*", cloudform_1.Fn.Ref("RootDomain")])],
    ValidationMethod: "DNS"
});
