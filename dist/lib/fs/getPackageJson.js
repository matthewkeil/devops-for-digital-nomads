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
const exists = util_1.default.promisify(fs_1.default.exists);
exports.getPackageJson = (folder) => __awaiter(void 0, void 0, void 0, function* () {
    const clientPkgLocation = path_1.default.resolve(__dirname, "..", "..", folder, "package.json");
    if (!(yield exists(clientPkgLocation))) {
        throw new Error(`could not locate a package.json in your ${folder} folder`);
    }
    return require(clientPkgLocation);
});
