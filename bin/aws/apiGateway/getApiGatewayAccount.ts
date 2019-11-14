import AWS from "aws-sdk";
import { config } from "../../../config";

const apiGateway = new AWS.APIGateway(config.AWS_SERVICE_CONFIG);
const iam = new AWS.IAM(config.AWS_SERVICE_CONFIG);

export const apiGatewayAccountExists = async () => {
    try {
        const { cloudwatchRoleArn } = await apiGateway.getAccount().promise();
        const RoleName = cloudwatchRoleArn.split("/")[1];
        await iam.getRole({ RoleName }).promise();
        return true;
    } catch (err) {
        if (err.code === "NoSuchEntity") return false;
    }
};
