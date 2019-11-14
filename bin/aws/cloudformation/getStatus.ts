import { config } from "../../../config";

const { CF } = config;

export const getStackStatus = async ({
    StackName
}: {
    StackName: string;
}): Promise<string | void> => {
    try {
        const response = await CF.describeStacks({ StackName }).promise();

        if (response.Stacks) {
            return response.Stacks[0].StackStatus;
        }
    } catch (err) {
        return undefined;
    }

    throw new Error("unknown error occurred trying to get stack status");
};
