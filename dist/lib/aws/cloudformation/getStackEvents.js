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
const { CF } = config_1.config;
exports.getStackEvents = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield CF.describeStackEvents(params).promise();
    let updateOrCreateNotReached = true;
    const results = response.StackEvents.map(event => ({
        Timestamp: event.Timestamp,
        LogicalResourceId: event.LogicalResourceId,
        ResourceType: event.ResourceType,
        ResourceStatus: event.ResourceStatus,
        StatusReason: event.ResourceStatusReason
    }))
        .filter(({ ResourceType, ResourceStatus }) => {
        if (!updateOrCreateNotReached)
            return false;
        if (ResourceType === "AWS::CloudFormation::Stack" &&
            (ResourceStatus === "UPDATE_IN_PROGRESS" || ResourceStatus === "CREATE_IN_PROGRESS")) {
            updateOrCreateNotReached = false;
        }
        return true;
    })
        .reverse();
    return results;
});
