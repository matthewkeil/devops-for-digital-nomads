import { CloudFront, Fn } from "cloudform";
import { config } from "../../config";
import { pascalCaseDomainName } from "../../bin";

export const ClientDistribution = new CloudFront.Distribution({
    DistributionConfig: {
        Aliases: [Fn.Join(".", [Fn.Ref("SubDomain"), config.ROOT_DOMAIN])],
        Comment: Fn.Join("", [
            "cloudfront distribution for ",
            Fn.Ref("SubDomain"),
            ".",
            config.ROOT_DOMAIN
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
                DomainName: Fn.GetAtt("ClientBucket", "DomainName"),
                S3OriginConfig: {
                    OriginAccessIdentity: Fn.Join("/", [
                        "origin-access-identity/cloudfront",
                        Fn.Ref("ClientOriginAccessIdentity")
                    ])
                }
            }
        ],
        PriceClass: "PriceClass_100", // PriceClass_100 | PriceClass_200 | PriceClass_All
        ViewerCertificate: {
            AcmCertificateArn: Fn.ImportValue(
                `${pascalCaseDomainName(config.ROOT_DOMAIN)}Certificate`
            ),
            MinimumProtocolVersion: "TLSv1.1_2016",
            SslSupportMethod: "sni-only"
        }
    }
}).dependsOn(["ClientBucket", "ClientOriginAccessIdentity"]);
