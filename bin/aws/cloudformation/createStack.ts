import { config } from "../../../config";

const { CF } = config;

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
