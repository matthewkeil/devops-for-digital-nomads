import AWS from "aws-sdk";
import { Method } from "./lib/interfaces/Method";
declare const AWS_SERVICE_CONFIG: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
};
export declare const config: {
    ROOT_DOMAIN: string;
    OWNER: string;
    REPO: string;
    REGION: string;
    AWS_SERVICE_CONFIG: typeof AWS_SERVICE_CONFIG;
    CF: AWS.CloudFormation;
    S3: AWS.S3;
    CORS?: boolean;
    ALLOWED_METHODS?: Method[];
    PROD?: boolean;
};
export {};
