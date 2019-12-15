"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const getAbsolutePathFromRootRelativePath_1 = require("../../fs/getAbsolutePathFromRootRelativePath");
const walkDirectory_1 = require("./walkDirectory");
exports.uploadDirectory = ({ localPath, uploadPath, Bucket }) => __awaiter(void 0, void 0, void 0, function* () {
    const path = getAbsolutePathFromRootRelativePath_1.getAbsolutePathFromRootRelativePath(localPath);
    // ensure that teh keyBase starts with a '/'. this is necessary
    // for the recursive walkDirectory function and the leading '/'
    // will be removed from the final objcet Prefix so a blank diretory
    // is not created.
    const keyBase = uploadPath === "/" || !uploadPath
        ? "/"
        : uploadPath.startsWith("/")
            ? uploadPath
            : "/".concat(uploadPath);
    yield walkDirectory_1.walkDirectory({ Bucket, path, keyBase });
    console.log(`finished uploading dist / to ${Bucket}`);
});
