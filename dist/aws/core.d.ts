export declare const buildCoreTemplate: (deployCert: boolean) => Promise<{
    Description: string;
    Parameters: {
        RootDomain: {
            Description: string;
            Type: string;
            Default: string;
        };
    };
    Resources: {
        HostedZone: import("cloudform-types/types/route53/hostedZone").default;
    };
    Outputs: {
        HostedZoneId: {
            Description: string;
            Value: import("cloudform").IntrinsicFunction;
            Export: {
                Name: string;
            };
        };
    };
}>;
