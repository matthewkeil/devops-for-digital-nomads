interface TemplateParams {
    branch: string;
    StackName: string;
}
export declare const buildServerTemplate: ({ branch, StackName }: TemplateParams) => string;
export {};
