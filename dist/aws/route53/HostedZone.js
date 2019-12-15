"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
exports.HostedZone = new cloudform_1.Route53.HostedZone({
    Name: cloudform_1.Fn.Ref("RootDomain"),
    HostedZoneConfig: {
        Comment: cloudform_1.Fn.Join(" ", [`hosted zone for`, cloudform_1.Fn.Ref("RootDomain")])
    }
});
