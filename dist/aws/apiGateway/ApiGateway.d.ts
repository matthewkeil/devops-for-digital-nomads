export declare const ApiGateway: {
    Type: string;
    Properties: {
        EndpointConfiguration: string;
        StageName: import("cloudform").IntrinsicFunction;
        MethodSettings: {
            ResourcePath: string;
            HttpMethod: string;
            LoggingLevel: string;
            DataTraceEnabled: boolean;
            MetricsEnabled: boolean;
            CachingEnabled: boolean;
        }[];
        AccessLogSetting: {
            DestinationArn: import("cloudform").IntrinsicFunction;
            Format: string;
        };
    };
};
