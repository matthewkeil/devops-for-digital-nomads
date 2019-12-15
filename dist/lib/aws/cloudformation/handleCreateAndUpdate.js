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
const getStatus_1 = require("./getStatus");
const createStack_1 = require("./createStack");
const updateStack_1 = require("./updateStack");
const deleteStack_1 = require("./deleteStack");
const getStackEvents_1 = require("./getStackEvents");
const route53_1 = require("../route53");
exports.handleStackCreateAndUpdate = (params) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     *
     * Cloudformation does not allow some stack states to be updated and thus
     * the stack must be deleted and recreated. First checks to see if stack exists,
     * if not creates it. If stack exists check status to see if can be updated, if
     * not, delete and recreate. If no issues go ahead and upadte the stack.
     *
     */
    const status = yield getStatus_1.getStackStatus(params);
    let events = [];
    const interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const fullList = yield getStackEvents_1.getStackEvents({ StackName: params.StackName });
        if (events.length !== fullList.length) {
            const currentLength = events.length;
            events = fullList;
            console.table(fullList
                .slice(currentLength)
                .filter(event => event.StatusReason.includes("Resource creation Initiated")));
        }
        const certCreationEvent = fullList.find(event => {
            if (event.ResourceType === "AWS::CertificateManager::Certificate" &&
                (event.StatusReason || "").includes("Content of DNS Record")) {
                return true;
            }
        });
        if (certCreationEvent) {
            const dnsRecord = certCreationEvent.StatusReason.split(": ");
            const recordSetName = dnsRecord[2].split(",")[0];
            const recordSetValue = dnsRecord[4].substr(0, dnsRecord[4].length - 1);
            yield route53_1.createCertRecordSet({
                StackName: params.StackName,
                recordSetName,
                recordSetValue
            });
        }
    }), 2000);
    switch (status) {
        case undefined:
            // no status means stack doesn't exist
            console.log(`${params.StackName} doest not exist, creating it`);
            yield createStack_1.createStack(params);
            break;
        case "ROLLBACK_COMPLETE" /* ROLLBACK_COMPLETE */:
        case "ROLLBACK_FAILED" /* ROLLBACK_FAILED */:
        case "UPDATE_ROLLBACK_FAILED" /* UPDATE_ROLLBACK_FAILED */:
        case "CREATE_FAILED" /* CREATE_FAILED */:
            // cases where delete must happen first
            console.log(`${params.StackName} is in a failed state. deleting first`);
            yield deleteStack_1.deleteStack(params);
            console.log("delete complete. rebuilding stack");
            yield createStack_1.createStack(params);
            break;
        default:
            // cases where ready for update
            yield updateStack_1.updateStack(params);
            break;
    }
    clearInterval(interval);
});
