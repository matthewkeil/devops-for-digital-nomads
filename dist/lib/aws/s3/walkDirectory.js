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
const util_1 = __importDefault(require("util"));
const path_1 = __importDefault(require("path"));
const uploadFile_1 = require("./uploadFile");
const STAT = util_1.default.promisify(fs_1.default.stat);
exports.walkDirectory = ({ path, keyBase, Bucket }) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        console.log("attempting to upload " + path);
        fs_1.default.readdir(path, (err, files) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                throw reject(err);
            yield Promise.all(files.map((object) => __awaiter(void 0, void 0, void 0, function* () {
                const current = path_1.default.join(path, object);
                const stat = yield STAT(current);
                if (stat.isDirectory()) {
                    return exports.walkDirectory({
                        Bucket,
                        path: current,
                        keyBase: `${keyBase}${object}/`
                    });
                }
                const Key = keyBase + object;
                return uploadFile_1.uploadFile({
                    Bucket,
                    Key: Key.slice(1),
                    path: current
                });
            })));
            console.log("finished uploading " + keyBase);
            resolve();
        }));
    });
});
