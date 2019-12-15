declare enum ALLOWED_METHODS {
    "GET" = 0,
    "POST" = 1,
    "PUT" = 2,
    "PATCH" = 3,
    "DELETE" = 4
}
declare const Methods: Set<"DELETE" | "GET" | "POST" | "PUT" | "PATCH">;
export { Methods };
export declare type Method = keyof typeof ALLOWED_METHODS;
