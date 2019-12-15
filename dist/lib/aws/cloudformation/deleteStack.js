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
const emptyStackBuckets_1 = require("./emptyStackBuckets");
const { CF } = config_1.config;
exports.deleteStack = ({ StackName, emptyBuckets }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`deleting stack ${StackName} through cloud formation`);
    if (emptyBuckets) {
        yield emptyStackBuckets_1.emptyStackBuckets({ StackName });
    }
    const response = yield CF.deleteStack({ StackName }).promise();
    console.log(response);
    const results = yield CF.waitFor("stackDeleteComplete", {
        StackName
    }).promise();
    console.log(results);
});
