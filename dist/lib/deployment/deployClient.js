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
require("dotenv").config();
const fs_1 = __importDefault(require("fs"));
const aws_1 = require("../aws");
const utils_1 = require("../utils");
const strings_1 = require("../strings");
const fs_2 = require("../fs");
const _config_1 = require("@config");
const client_1 = require("../../aws/client");
const getClientBuildCommand_1 = require("../utils/getClientBuildCommand");
exports.deployClient = () => __awaiter(void 0, void 0, void 0, function* () {
    const branch = utils_1.getLocalGitBranch();
    console.log(`deploying current git branch: ${branch}`);
    let rebuild = false;
    if (process.argv.find(arg => arg.includes("build"))) {
        rebuild = true;
    }
    const clientDistLocation = "client/dist";
    let buildPromise = Promise.resolve();
    if (rebuild ||
        !fs_1.default.existsSync(fs_2.getAbsolutePathFromRootRelativePath(clientDistLocation))) {
        const command = getClientBuildCommand_1.getClientBuildCommand();
        console.log(`rebuilding client repo using "${command}"`);
        buildPromise = utils_1.exec(`cd client && export NODE_ENV=production && ${command}`);
    }
    const domain = _config_1.config.ROOT_DOMAIN;
    // make sure bucket exists, if not build stack with bucket and routing
    const Bucket = strings_1.getDomainName({
        branch,
        domain
    });
    let bucketPromise;
    if (yield aws_1.bucketExists({ Bucket })) {
        console.log(`found existing artifacts bucket`);
        bucketPromise = aws_1.emptyBucket({ Bucket });
    }
    else {
        console.log(`building bucket and dns routing stack for ${Bucket}`);
        const StackName = strings_1.getStackName({ branch, domain, stack: "client" });
        const TemplateBody = client_1.clientTemplate({ branch, StackName });
        bucketPromise = aws_1.handleStackCreateAndUpdate({
            StackName,
            TemplateBody
        });
    }
    yield Promise.all([bucketPromise, buildPromise]);
    yield aws_1.uploadDirectory({ Bucket, localPath: clientDistLocation });
    yield aws_1.createCacheInvalidation({ Bucket });
});
