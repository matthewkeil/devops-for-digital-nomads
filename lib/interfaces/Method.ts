enum ALLOWED_METHODS {
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
}
const Methods = new Set<keyof typeof ALLOWED_METHODS>();
for (const method of Object.keys(ALLOWED_METHODS)) {
    if (typeof method === "string") {
        Methods.add(method as keyof typeof ALLOWED_METHODS);
    }
}
export { Methods };
export type Method = keyof typeof ALLOWED_METHODS;
