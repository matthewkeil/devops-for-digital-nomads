if (!process.env.GITHUB_ACCESS_TOKEN) {
    require("dotenv").config();

    if (!process.env.GITHUB_ACCESS_TOKEN) {
        throw new Error("could not locate a GITHUB_ACCESS_TOKEN");
    }
}

import AWS from "aws-sdk";
import { config } from "@config";

const ssm = new AWS.SSM(config.AWS_SERVICE_CONFIG);

export const storeSecretString = async ({ Name }: { Name?: string }) => {
    let parameter: AWS.SSM.GetParameterResult;

    try {
        parameter = await ssm
            .getParameter({ Name, WithDecryption: true })
            .promise();
    } catch (err) {
        if (err.code !== "ParameterNotFound") {
            throw err;
        }
    }

    const oldValue = parameter.Parameter.Value;
    const newValue = process.env[Name];

    if (oldValue && newValue !== oldValue) {
        console.log(oldValue, newValue);
        console.log("local secret is different from online secret. updating");
    }

    // const results = await ssm.putParameter({
    //     Name,
    //     Value,
    //     Type: 'SecureString'
    // }).promise();
};

storeSecretString({ Name: "GITHUB_ACCESS_TOKEN" });
