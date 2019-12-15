interface WalkDirectoryProps {
    path: string;
    keyBase: string;
    Bucket: string;
}
export declare const walkDirectory: ({ path, keyBase, Bucket }: WalkDirectoryProps) => Promise<unknown>;
export {};
