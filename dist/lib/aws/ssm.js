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
if (!process.env.GITHUB_ACCESS_TOKEN) {
    require("dotenv").config();
    if (!process.env.GITHUB_ACCESS_TOKEN) {
        throw new Error("could not locate a GITHUB_ACCESS_TOKEN");
    }
}
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const _config_1 = require("@config");
const ssm = new aws_sdk_1.default.SSM(_config_1.config.AWS_SERVICE_CONFIG);
exports.storeSecretString = ({ Name }) => __awaiter(void 0, void 0, void 0, function* () {
    let parameter;
    try {
        parameter = yield ssm
            .getParameter({ Name, WithDecryption: true })
            .promise();
    }
    catch (err) {
        if (err.code !== "ParameterNotFound") {
            throw err;
        }
    }
    const oldValue = parameter.Parameter.Value;
    const newValue = process.env[Name];
    if (oldValue && newValue !== oldValue) {
        console.log(oldValue, newValue);
        console.log("local secret is different from online secret. updating");
    }
    // const results = await ssm.putParameter({
    //     Name,
    //     Value,
    //     Type: 'SecureString'
    // }).promise();
});
exports.storeSecretString({ Name: "GITHUB_ACCESS_TOKEN" });
