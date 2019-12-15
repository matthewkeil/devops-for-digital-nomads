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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = require("../../config");
const apiGateway = new aws_sdk_1.default.APIGateway(config_1.config.AWS_SERVICE_CONFIG);
const iam = new aws_sdk_1.default.IAM(config_1.config.AWS_SERVICE_CONFIG);
exports.apiGatewayAccountExists = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cloudwatchRoleArn } = yield apiGateway.getAccount().promise();
        const RoleName = cloudwatchRoleArn.split("/")[1];
        yield iam.getRole({ RoleName }).promise();
        return true;
    }
    catch (err) {
        if (err.code === "NoSuchEntity")
            return false;
    }
});
