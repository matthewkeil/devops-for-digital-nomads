import { Fn, S3 } from "cloudform";
import { config } from "../../config";

export const ClientBucket = new S3.Bucket({
    BucketName: Fn.Join(".", [Fn.Ref("SubDomain"), config.ROOT_DOMAIN]),
    AccessControl: "PublicRead",
    WebsiteConfiguration: {
        ErrorDocument: "index.html",
        IndexDocument: "index.html"
    },
    CorsConfiguration: {
        CorsRules: [
            {
                AllowedHeaders: ["*"],
                AllowedMethods: ["GET", "HEAD"],
                AllowedOrigins: ["*"]
            }
        ]
    }
});
