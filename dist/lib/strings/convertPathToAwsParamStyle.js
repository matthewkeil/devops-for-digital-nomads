"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPathToAwsParamStyle = (path) => {
    const segments = path.startsWith("/")
        ? path.slice(1).split("/")
        : path.split("/");
    const updated = segments.map(segment => {
        if (segment.startsWith(":")) {
            return "{" + segment.slice(1) + "}";
        }
        return segment;
    });
    return "/" + updated.join("/");
};
