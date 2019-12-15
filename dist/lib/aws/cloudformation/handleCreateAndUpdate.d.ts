import AWS from "aws-sdk";
export declare const handleStackCreateAndUpdate: (params: AWS.CloudFormation.CreateStackInput | AWS.CloudFormation.UpdateStackInput) => Promise<void>;
