export declare const getStackEvents: (params: import("aws-sdk/clients/cloudformation").DescribeStackEventsInput) => Promise<{
    Timestamp: Date;
    LogicalResourceId: string;
    ResourceType: string;
    ResourceStatus: string;
    StatusReason: string;
}[]>;
