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
const config_1 = require("../../../config");
const { S3 } = config_1.config;
exports.emptyBucket = ({ Bucket }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`attempting to empty ${Bucket}`);
    const { Contents } = yield S3.listObjects({
        Bucket
    }).promise();
    if (Contents && !!Contents.length) {
        yield Promise.all(Contents.map(({ Key }) => S3.deleteObject({
            Bucket,
            Key
        }).promise()));
        console.log(`Bucket ${Bucket} is empty`);
    }
});
