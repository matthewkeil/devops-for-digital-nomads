import { SecretsManager } from "aws-sdk";
import { ENV } from "./ENV";

const secretsManager = new SecretsManager({ region: ENV.REGION });

const SecretId = "ACCESS_TOKENS";
type KeyName =
    | "GITHUB_OAUTH_TOKEN"
    | "GITHUB_SSH_KEY"
    | "GOOGLE_PRIVATE_KEY"
    | "APPLE_PRIVATE_KEY";

export const getSecrets = async (keyName: KeyName) => {
    try {
        // Decrypts secret using the associated KMS CMK.
        const secrets: SecretsManager.GetSecretValueResponse = await secretsManager
            .getSecretValue({ SecretId })
            .promise();

        // Depending on whether the secret is a string or binary, one of these fields will be populated.
        if (
            "SecretString" in secrets &&
            typeof secrets.SecretString === "string"
        ) {
            return JSON.parse(secrets.SecretString)[keyName];
        }

        let buff = new Buffer(secrets.SecretBinary as string, "base64");

        return JSON.parse(buff.toString("ascii"))[keyName];
    } catch (err) {
        console.error(JSON.stringify(err));
        // In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
        // See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        // We rethrow the exception by default.
        switch (err.code) {
            case "DecryptionFailureException":
                // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
                // Deal with the exception here, and/or rethrow at your discretion
                break;
            case "InternalServiceErrorException":
                // An error occurred on the server side.
                // Deal with the exception here, and/or rethrow at your discretion.
                break;
            case "InvalidParameterException":
                // You provided an invalid value for a parameter.
                // Deal with the exception here, and/or rethrow at your discretion.
                break;
            case "InvalidRequestException":
                // You provided a parameter value that is not valid for the current state of the resource.
                // Deal with the exception here, and/or rethrow at your discretion.
                break;
            case "ResourceNotFoundException":
                // We can't find the resource that you asked for.
                // Deal with the exception here, and/or rethrow at your discretion.
                break;
            default:
                throw err;
        }
    }
};
