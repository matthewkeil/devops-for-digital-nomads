interface UploadFileProps {
    Bucket: string;
    Key: string;
    path: string;
}
export declare const uploadFile: ({ Bucket, Key, path }: UploadFileProps) => Promise<import("aws-sdk/clients/s3").ManagedUpload.SendData>;
export {};
