interface ArtifactsBucketNameParameters {
    domain: string;
    branch: string;
}
export declare const getArtifactsBucketName: ({ domain, branch }: ArtifactsBucketNameParameters) => string;
export {};
