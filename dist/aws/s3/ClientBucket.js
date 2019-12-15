"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
const config_1 = require("../../config");
exports.ClientBucket = new cloudform_1.S3.Bucket({
    BucketName: cloudform_1.Fn.Join(".", [cloudform_1.Fn.Ref("SubDomain"), config_1.config.ROOT_DOMAIN]),
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
