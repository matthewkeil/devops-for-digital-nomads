import { pascalCaseDomainName } from "../../utils";

interface StackNameParameters {
    stack: 'core' | 'client' | 'server';
    domain: string;
    branch: string;
}

export const getStackName = ({ stack, domain, branch }: StackNameParameters) => stack === 'core'
    ? `${pascalCaseDomainName(domain)}-${stack}`
    : `${pascalCaseDomainName(domain)}-${stack}-${branch}`