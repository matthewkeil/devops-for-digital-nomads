import { pascalCaseDomainName } from "../utils";

interface ArtifactsBucketNameParameters {
    domain: string;
    branch: string;
}

export const getArtifactsBucketName = ({
    domain,
    branch
}: ArtifactsBucketNameParameters) =>
    `${pascalCaseDomainName(domain)}-${branch}-server`;
