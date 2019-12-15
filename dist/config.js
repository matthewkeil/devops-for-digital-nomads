"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (!process.env.AWS_ACCESS_KEY_ID) {
    require("dotenv").config();
}
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const REGION = "us-east-1";
const AWS_SERVICE_CONFIG = {
    region: REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};
exports.config = {
    ROOT_DOMAIN: "matthewkeil.com",
    OWNER: "matthewkeil",
    REPO: "matthewkeil.com",
    REGION,
    AWS_SERVICE_CONFIG,
    CF: new aws_sdk_1.default.CloudFormation(AWS_SERVICE_CONFIG),
    S3: new aws_sdk_1.default.S3(AWS_SERVICE_CONFIG)
};
