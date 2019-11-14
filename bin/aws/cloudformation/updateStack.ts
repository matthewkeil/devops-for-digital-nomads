import { config } from "../../../config";

const { CF } = config;

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
