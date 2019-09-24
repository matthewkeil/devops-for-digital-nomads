import { StatusCode } from "./HttpStatusCode";

export interface Response {
    isBase64Encoded?: boolean;
    statusCode?: StatusCode;
    headers?: { [name: string]: string };
    // multiValueHeaders: { "headerName": ["headerValue", "headerValue2", ...], ... },
    body?: {} | string;
}
