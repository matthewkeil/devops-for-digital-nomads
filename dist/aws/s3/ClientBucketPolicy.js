"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
exports.ClientBucketPolicy = new cloudform_1.S3.BucketPolicy({
    Bucket: cloudform_1.Fn.Ref("ClientBucket"),
    PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "Allow CloudFront read access",
                Effect: "Allow",
                Action: "s3:GetObject",
                Resource: cloudform_1.Fn.Join("", [cloudform_1.Fn.GetAtt("ClientBucket", "Arn"), "/*"]),
                Principal: {
                    CanonicalUser: cloudform_1.Fn.GetAtt("ClientOriginAccessIdentity", "S3CanonicalUserId")
                }
            }
        ]
    }
}).dependsOn("ClientOriginAccessIdentity");
