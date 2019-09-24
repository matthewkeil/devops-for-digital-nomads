import { IncomingHttpHeaders } from "http";

export interface Request {
    body?: any;
    parameters?: { [name: string]: string };
    headers?: IncomingHttpHeaders;
}
