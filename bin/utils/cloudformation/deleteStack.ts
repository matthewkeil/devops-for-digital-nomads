import { config } from "../../../config";
import { emptyStackBuckets } from "./emptyStackBuckets";

const { CF } = config;

interface DeleteStackParams {
    StackName: string;
    emptyBuckets?: boolean;
}

export const deleteStack = async ({
    StackName,
    emptyBuckets
}: DeleteStackParams) => {
    console.log(`deleting stack ${StackName} through cloud formation`);

    if (emptyBuckets) {
        await emptyStackBuckets({ StackName });
    }

    const response = await CF.deleteStack({ StackName }).promise();

    console.log(response);

    const results = await CF.waitFor("stackDeleteComplete", {
        StackName
    }).promise();

    console.log(results);
};
