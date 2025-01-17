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
exports.getStack = void 0;
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default("devops:lib:aws:cloudformation:getStackStatus");
const config_1 = require("../../../config");
exports.getStack = ({ StackName }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield config_1.config.cf.describeStacks({ StackName }).promise();
        debug(response);
        if (response.Stacks) {
            return response.Stacks[0];
        }
    }
    catch (err) {
        debug("getStack anticipated failure if missing: ", err);
        return undefined;
    }
    throw new Error("unknown error occurred trying to get stack status");
});
//# sourceMappingURL=getStack.js.map