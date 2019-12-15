"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomainName = ({ branch, domain }) => {
    let _branch = branch;
    if (branch === "master") {
        _branch = "www";
    }
    return `${_branch}.${domain}`;
};
