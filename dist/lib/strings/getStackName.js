"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pascalCaseDomainName_1 = require("./pascalCaseDomainName");
exports.getStackName = ({ stack, domain, branch }) => stack === "core"
    ? `${pascalCaseDomainName_1.pascalCaseDomainName(domain)}-${stack}`
    : `${pascalCaseDomainName_1.pascalCaseDomainName(domain)}-${stack}-${branch}`;
