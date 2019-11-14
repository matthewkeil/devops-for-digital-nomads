import { config } from "../../../config";

const { CF } = config;

export const getStackEvents = async (
    params: AWS.CloudFormation.DescribeStackEventsInput
) => {
    const response = await CF.describeStackEvents(params).promise();

    let updateOrCreateNotReached = true;

    const results = response.StackEvents.map(event => ({
        Timestamp: event.Timestamp,
        LogicalResourceId: event.LogicalResourceId,
        ResourceType: event.ResourceType,
        ResourceStatus: event.ResourceStatus,
        StatusReason: event.ResourceStatusReason
    }))
        .filter(({ ResourceType, ResourceStatus }) => {
            if (!updateOrCreateNotReached) return false;

            if (
                ResourceType === "AWS::CloudFormation::Stack" &&
                (ResourceStatus === "UPDATE_IN_PROGRESS" ||
                    ResourceStatus === "CREATE_IN_PROGRESS")
            ) {
                updateOrCreateNotReached = false;
            }

            return true;
        })
        .reverse();

    return results;
};
