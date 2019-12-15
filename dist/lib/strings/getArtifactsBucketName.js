"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pascalCaseDomainName_1 = require("./pascalCaseDomainName");
exports.getArtifactsBucketName = ({ domain, branch }) => `${pascalCaseDomainName_1.pascalCaseDomainName(domain)}-${branch}-server`;
