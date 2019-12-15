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
const rest_1 = __importDefault(require("@octokit/rest"));
const getLocalGitBranch_1 = require("./getLocalGitBranch");
exports.checkBranchExistsOnGithub = ({ owner, repo }) => __awaiter(void 0, void 0, void 0, function* () {
    let branches;
    const localBranch = getLocalGitBranch_1.getLocalGitBranch();
    const octokit = new rest_1.default({
        auth: process.env.GITHUB_ACCESS_TOKEN
    });
    try {
        branches = yield octokit.repos.listBranches({
            owner,
            repo
        });
    }
    catch (err) {
        if (err.name == "HttpError") {
            throw new Error("GITHUB_ACCESS_TOKEN is missing from your .env file");
        }
        throw err;
    }
    if (branches.data &&
        Array.isArray(branches.data) &&
        branches.data.findIndex((b) => b.name === localBranch) === -1) {
        throw new Error(`branch ${localBranch} does not exist on ${owner}/${repo}`);
    }
    return localBranch;
});
