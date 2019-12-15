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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = require("mime-types");
const config_1 = require("../../../config");
const { S3 } = config_1.config;
exports.uploadFile = ({ Bucket, Key, path }) => __awaiter(void 0, void 0, void 0, function* () {
    const contentType = mime_types_1.lookup(Key);
    const response = yield S3.upload({
        Bucket,
        Key,
        ACL: "public-read",
        ContentEncoding: "utf-8",
        ContentType: contentType ? contentType : "application/octet-stream",
        Body: fs_1.default.createReadStream(path, { autoClose: true })
    }).promise();
    return response;
});
