"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ALLOWED_METHODS;
(function (ALLOWED_METHODS) {
    ALLOWED_METHODS[ALLOWED_METHODS["GET"] = 0] = "GET";
    ALLOWED_METHODS[ALLOWED_METHODS["POST"] = 1] = "POST";
    ALLOWED_METHODS[ALLOWED_METHODS["PUT"] = 2] = "PUT";
    ALLOWED_METHODS[ALLOWED_METHODS["PATCH"] = 3] = "PATCH";
    ALLOWED_METHODS[ALLOWED_METHODS["DELETE"] = 4] = "DELETE";
})(ALLOWED_METHODS || (ALLOWED_METHODS = {}));
const Methods = new Set();
exports.Methods = Methods;
for (const method of Object.keys(ALLOWED_METHODS)) {
    if (typeof method === "string") {
        Methods.add(method);
    }
}
