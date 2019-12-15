"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
const _config_1 = require("@config");
const lib_1 = require("../../lib");
exports.ClientRecordSet = new cloudform_1.Route53.RecordSet({
    Name: cloudform_1.Fn.Join(".", [cloudform_1.Fn.Ref("SubDomain"), _config_1.config.ROOT_DOMAIN]),
    Type: "A",
    HostedZoneId: cloudform_1.Fn.ImportValue(`${lib_1.pascalCaseDomainName(_config_1.config.ROOT_DOMAIN)}HostedZone`),
    AliasTarget: {
        DNSName: cloudform_1.Fn.GetAtt("ClientDistribution", "DomainName"),
        HostedZoneId: "Z2FDTNDATAQYW2"
    }
}).dependsOn("ClientDistribution");
