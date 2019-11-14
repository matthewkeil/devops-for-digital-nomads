if (!process.env.AWS_ACCESS_KEY_ID) {
    require('dotenv').config();
}

import AWS from 'aws-sdk';

const REGION = 'us-east-1';

const AWS_SERVICE_CONFIG = {
    region: REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

const CF = new AWS.CloudFormation(AWS_SERVICE_CONFIG);

const S3 = new AWS.S3(AWS_SERVICE_CONFIG);

export const config = {
    ROOT_DOMAIN: 'matthewkeil.com',
    OWNER: 'matthewkeil',
    REPO: 'matthewkeil.com',
    REGION,
    CF,
    S3,
    AWS_SERVICE_CONFIG
}