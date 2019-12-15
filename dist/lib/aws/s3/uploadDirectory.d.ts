interface UploadDirectoryParams {
    localPath: string;
    uploadPath?: string;
    Bucket: string;
}
export declare const uploadDirectory: ({ localPath, uploadPath, Bucket }: UploadDirectoryParams) => Promise<void>;
export {};
