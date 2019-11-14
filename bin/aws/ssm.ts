if (!process.env.GITHUB_ACCESS_TOKEN) {
    require('dotenv').config();
}

import AWS from 'aws-sdk';
import { config } from '../../config';

const ssm = new AWS.SSM(config.AWS_SERVICE_CONFIG);

export const storeOauthToken = async () => {
    let stored

    try {
        stored = await ssm.getParameter({ Name: "GITHUB_ACCESS_TOKEN", WithDecryption: true }).promise();
    } catch (err) {
        if (err.code !== 'ParameterNotFound') {
            throw err;
        }
    }

    const token = process.env.GITHUB_ACCESS_TOKEN;

    if (token && token !== stored) {
        console.log('local token is different from online token. updating');
    }

    if (!token) {
        throw new Error('Github Oath token not found in .env file on key GITHUB_ACCESS_TOKEN');
    }

    // const results = await ssm.putParameter({
    //     Name,
    //     Value,
    //     Type: 'SecureString'
    // }).promise();
}

storeOauthToken().then(console.log)