"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const PATH = __importStar(require("path"));
exports.getAbsolutePathFromRootRelativePath = (path) => {
    const segments = Array.isArray(path) ? path : path.split("/").filter(segment => !!segment);
    return PATH.resolve(__dirname, "..", "..", ...segments);
};
