/**
 *
 * Fn.Ref('OriginAccessIdentity') returns access identity, such as E15MNIMTCFKK4C.
 * Fn.GetAtt('OriginAccessIdentity', 'S3CanonicalUserId') returns Amazon S3 canonical user ID
 *  - for example: b970b42360b81c8ddbd79d2f5df0069ba9033c8a79655752abe380cd6d63ba8bcf23384d568fcf89fc49700b5e11a0fd
 *
 */
export declare const ClientOriginAccessIdentity: import("cloudform-types/types/cloudFront/cloudFrontOriginAccessIdentity").default;
