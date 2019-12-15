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
const { CF } = config_1.config;
const route53 = new aws_sdk_1.default.Route53(config_1.config.AWS_SERVICE_CONFIG);
exports.createCertRecordSet = ({ StackName, recordSetName, recordSetValue }) => __awaiter(void 0, void 0, void 0, function* () {
    const { StackResourceSummaries } = yield CF.listStackResources({
        StackName
    }).promise();
    const { PhysicalResourceId: HostedZoneId } = StackResourceSummaries.find(resource => resource.ResourceType === "AWS::Route53::HostedZone");
    const { ResourceRecordSets } = yield route53
        .listResourceRecordSets({
        HostedZoneId,
        StartRecordName: recordSetName,
        StartRecordType: "CNAME"
    })
        .promise();
    if (!!ResourceRecordSets.length) {
        return;
    }
    console.log(`found request for SSL RecordSet creation at\n${recordSetName}\nfor validation by\n${recordSetValue}\n`);
    yield route53
        .changeResourceRecordSets({
        HostedZoneId,
        ChangeBatch: {
            Changes: [
                {
                    Action: "UPSERT",
                    ResourceRecordSet: {
                        Name: recordSetName,
                        ResourceRecords: [
                            {
                                Value: recordSetValue
                            }
                        ],
                        TTL: 60,
                        Type: "CNAME"
                    }
                }
            ],
            Comment: "RecordSet for SSL Certificate Validation"
        }
    })
        .promise();
    console.log("successfully created SSL RecordSet for DNS validation");
});
