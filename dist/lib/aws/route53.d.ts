interface CertRecordSetParams {
    StackName: string;
    recordSetName: string;
    recordSetValue: string;
}
export declare const createCertRecordSet: ({ StackName, recordSetName, recordSetValue }: CertRecordSetParams) => Promise<void>;
export {};
