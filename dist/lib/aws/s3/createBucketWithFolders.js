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
const _config_1 = require("@config");
const { S3 } = _config_1.config;
exports.createBucketWithFolders = ({ Bucket, folders }) => __awaiter(void 0, void 0, void 0, function* () {
    yield S3.createBucket({
        Bucket
    }).promise();
    if (Array.isArray(folders)) {
        for (const folder of folders) {
            yield S3.putObject({
                Bucket,
                Key: `${folder}/`
            }).promise();
        }
    }
    return Bucket;
});
