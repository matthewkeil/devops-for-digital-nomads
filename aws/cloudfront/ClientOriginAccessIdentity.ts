import { CloudFront, Fn } from "cloudform";
import { config } from "../../config";
/**
 *
 * Fn.Ref('OriginAccessIdentity') returns access identity, such as E15MNIMTCFKK4C.
 * Fn.GetAtt('OriginAccessIdentity', 'S3CanonicalUserId') returns Amazon S3 canonical user ID
 *  - for example: b970b42360b81c8ddbd79d2f5df0069ba9033c8a79655752abe380cd6d63ba8bcf23384d568fcf89fc49700b5e11a0fd
 *
 */

export const ClientOriginAccessIdentity = new CloudFront.CloudFrontOriginAccessIdentity(
    {
        CloudFrontOriginAccessIdentityConfig: {
            Comment: Fn.Join("", [
                `origin access identity for `,
                Fn.Ref("SubDomain"),
                ".",
                config.ROOT_DOMAIN
            ])
        }
    }
);
