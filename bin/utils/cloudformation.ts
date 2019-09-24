import * as AWS from "aws-sdk";

/**
 *
 * setup for AWS services
 *
 */
const AWS_SERVICE_CONFIG = {
    region: process.env.REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

const CF = new AWS.CloudFormation(AWS_SERVICE_CONFIG);

export const enum Status {
    CREATE_COMPLETE = "CREATE_COMPLETE",
    CREATE_IN_PROGRESS = "CREATE_IN_PROGRESS",
    CREATE_FAILED = "CREATE_FAILED",
    DELETE_COMPLETE = "DELETE_COMPLETE",
    DELETE_FAILED = "DELETE_FAILED",
    DELETE_IN_PROGRESS = "DELETE_IN_PROGRESS",
    REVIEW_IN_PROGRESS = "REVIEW_IN_PROGRESS",
    ROLLBACK_COMPLETE = "ROLLBACK_COMPLETE", // delete must follow
    ROLLBACK_FAILED = "ROLLBACK_FAILED",
    ROLLBACK_IN_PROGRESS = "ROLLBACK_IN_PROGRESS",
    UPDATE_COMPLETE = "UPDATE_COMPLETE",
    UPDATE_COMPLETE_CLEANUP_IN_PROGRESS = "UPDATE_COMPLETE_CLEANUP_IN_PROGRESS",
    UPDATE_IN_PROGRESS = "UPDATE_IN_PROGRESS",
    UPDATE_ROLLBACK_COMPLETE = "UPDATE_ROLLBACK_COMPLETE",
    UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS = "UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS",
    UPDATE_ROLLBACK_FAILED = "UPDATE_ROLLBACK_FAILED", // delete or continue rollback must follow
    UPDATE_ROLLBACK_IN_PROGRESS = "UPDATE_ROLLBACK_IN_PROGRESS"
}

export const getStackStatus = async (name: string): Promise<string | void> => {
    try {
        const response = await CF.describeStacks({ StackName: name }).promise();

        if (response.Stacks) {
            return response.Stacks[0].StackStatus;
        }
    } catch (err) {
        return undefined;
    }

    throw new Error("unknown error occurred trying to get stack status");
};

export const createStack = async (
    params: AWS.CloudFormation.CreateStackInput
) => {
    console.log(`creating stack ${params.StackName} through cloud formation`);

    const response = await CF.createStack(params).promise();

    console.log(response);

    const results = await CF.waitFor("stackCreateComplete", {
        StackName: response.StackId
    }).promise();

    console.log(results);
};

export const updateStack = async (
    params: AWS.CloudFormation.UpdateStackInput
) => {
    console.log(`updating stack ${params.StackName} through cloud formation`);

    const response: any = await CF.updateStack(params).promise();

    console.log(response);

    const results = await CF.waitFor("stackUpdateComplete", {
        StackName: response.StackId
    }).promise();

    console.log(results);
};

export const deleteStack = async ({
    StackName
}: AWS.CloudFormation.DeleteStackInput) => {
    console.log(`deleting stack ${StackName} through cloud formation`);

    const response = await CF.deleteStack({ StackName }).promise();

    console.log(response);

    const results = await CF.waitFor("stackDeleteComplete", {
        StackName
    }).promise();

    console.log(results);
};
