"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
const _config_1 = require("@config");
const lib_1 = require("../../lib");
exports.ClientDistribution = new cloudform_1.CloudFront.Distribution({
    DistributionConfig: {
        Aliases: [cloudform_1.Fn.Join(".", [cloudform_1.Fn.Ref("SubDomain"), _config_1.config.ROOT_DOMAIN])],
        Comment: cloudform_1.Fn.Join("", [
            "cloudfront distribution for ",
            cloudform_1.Fn.Ref("SubDomain"),
            ".",
            _config_1.config.ROOT_DOMAIN
        ]),
        CustomErrorResponses: [
            {
                ErrorCachingMinTTL: 60,
                ErrorCode: 404,
                ResponseCode: 404,
                ResponsePagePath: "/index.html"
            }
        ],
        DefaultCacheBehavior: {
            AllowedMethods: ["GET", "HEAD"],
            TargetOriginId: "s3Origin",
            Compress: true,
            DefaultTTL: 1,
            MinTTL: 1,
            ViewerProtocolPolicy: "redirect-to-https",
            ForwardedValues: {
                QueryString: false,
                Cookies: {
                    Forward: "none"
                }
            }
        },
        DefaultRootObject: "index.html",
        Enabled: true,
        HttpVersion: "http2",
        // Logging: {
        //     IncludeCookies: false,
        //     Bucket: '', // TODO:
        //     Prefix: '' // TODO:
        // },
        Origins: [
            {
                Id: "s3Origin",
                DomainName: cloudform_1.Fn.GetAtt("ClientBucket", "DomainName"),
                S3OriginConfig: {
                    OriginAccessIdentity: cloudform_1.Fn.Join("/", [
                        "origin-access-identity/cloudfront",
                        cloudform_1.Fn.Ref("ClientOriginAccessIdentity")
                    ])
                }
            }
        ],
        PriceClass: "PriceClass_100",
        ViewerCertificate: {
            AcmCertificateArn: cloudform_1.Fn.ImportValue(`${lib_1.pascalCaseDomainName(_config_1.config.ROOT_DOMAIN)}Certificate`),
            MinimumProtocolVersion: "TLSv1.1_2016",
            SslSupportMethod: "sni-only"
        }
    }
}).dependsOn(["ClientBucket", "ClientOriginAccessIdentity"]);
