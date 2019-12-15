"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
exports.getLocalGitBranch = () => {
    const output = child_process_1.default.execSync("git status");
    const results = /^On\sbranch\s([\S]*).*/.exec(output.toString());
    if (!results) {
        throw new Error("Cannot determine what branch you are on");
    }
    return results[1];
};
