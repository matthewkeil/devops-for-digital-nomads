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
const emptyBucket_1 = require("../s3/emptyBucket");
const config_1 = require("../../../config");
const { CF } = config_1.config;
exports.emptyStackBuckets = ({ StackName }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`looking for s3 buckets to empty in stack ${StackName}`);
    const response = yield CF.listStackResources({ StackName }).promise();
    const bucketPhysicalResourceIds = response.StackResourceSummaries.filter((resource) => resource.ResourceType === "AWS::S3::Bucket").map((resource) => resource.PhysicalResourceId);
    console.log(`stack has buckets named ${bucketPhysicalResourceIds.join(", ")}`);
    yield Promise.all(bucketPhysicalResourceIds.map(Bucket => {
        return emptyBucket_1.emptyBucket({ Bucket });
    }));
});
