"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelCaseDomainName = (domain) => domain
    .split(".")
    .map((segment, index) => {
    if (index !== 0) {
        return segment[0].toUpperCase() + segment.substr(1);
    }
    return segment;
})
    .join("");
exports.pascalCaseDomainName = (domain) => domain
    .split(".")
    .map(segment => segment[0].toUpperCase() + segment.substr(1))
    .join("");
