import { Fn, Refs, S3 } from "cloudform";
import { VersioningConfiguration } from "cloudform-types/types/s3/bucket";

export const ArtifactsBucket = new S3.Bucket({
    BucketName: Fn.Join("-", [Refs.StackName, "artifacts"]),
    VersioningConfiguration: new VersioningConfiguration({ Status: "Enabled" })
});
