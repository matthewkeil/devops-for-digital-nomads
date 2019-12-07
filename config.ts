if (!process.env.AWS_ACCESS_KEY_ID) {
    require("dotenv").config();
}
import AWS from "aws-sdk";
import { Method } from "./lib/interfaces/Method";
const REGION = "us-east-1";
const AWS_SERVICE_CONFIG = {
    region: REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};
export const config: {
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
} = {
    ROOT_DOMAIN: "matthewkeil.com",
    OWNER: "matthewkeil",
    REPO: "matthewkeil.com",
    REGION,
    AWS_SERVICE_CONFIG,
    CF: new AWS.CloudFormation(AWS_SERVICE_CONFIG),
    S3: new AWS.S3(AWS_SERVICE_CONFIG)
};
