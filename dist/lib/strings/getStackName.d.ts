interface StackNameParameters {
    stack: "core" | "client" | "server";
    domain: string;
    branch: string;
}
export declare const getStackName: ({ stack, domain, branch }: StackNameParameters) => string;
export {};
