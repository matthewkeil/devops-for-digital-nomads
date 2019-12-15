interface DeleteStackParams {
    StackName: string;
    emptyBuckets?: boolean;
}
export declare const deleteStack: ({ StackName, emptyBuckets }: DeleteStackParams) => Promise<void>;
export {};
