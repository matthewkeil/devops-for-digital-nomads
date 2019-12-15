"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
const config_1 = require("../../config");
/**
 *
 * Fn.Ref('OriginAccessIdentity') returns access identity, such as E15MNIMTCFKK4C.
 * Fn.GetAtt('OriginAccessIdentity', 'S3CanonicalUserId') returns Amazon S3 canonical user ID
 *  - for example: b970b42360b81c8ddbd79d2f5df0069ba9033c8a79655752abe380cd6d63ba8bcf23384d568fcf89fc49700b5e11a0fd
 *
 */
exports.ClientOriginAccessIdentity = new cloudform_1.CloudFront.CloudFrontOriginAccessIdentity({
    CloudFrontOriginAccessIdentityConfig: {
        Comment: cloudform_1.Fn.Join("", [
            `origin access identity for `,
            cloudform_1.Fn.Ref("SubDomain"),
            ".",
            config_1.config.ROOT_DOMAIN
        ])
    }
});
