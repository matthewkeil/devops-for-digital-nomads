"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const getAbsolutePathFromRootRelativePath_1 = require("../fs/getAbsolutePathFromRootRelativePath");
const samlDirectory = getAbsolutePathFromRootRelativePath_1.getAbsolutePathFromRootRelativePath("server/dist");
const samlName = path_1.default.join(samlDirectory, "saml.yml");
exports.saveSaml = (template) => {
    if (!fs_1.default.existsSync(samlDirectory)) {
        fs_1.default.mkdirSync(samlDirectory);
    }
    fs_1.default.writeFileSync(samlName, require("json2yaml").stringify(JSON.parse(template)));
};
