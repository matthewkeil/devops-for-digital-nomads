import { Handler } from "./Handler";
import { Method } from "./Method";

export interface Route {
    [name: string]: any;
    handler: Handler;
    method: Method;
    path: string;
    auth: boolean;
}
