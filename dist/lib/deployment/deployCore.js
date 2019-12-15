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
const cloudform_1 = __importDefault(require("cloudform"));
const aws_1 = require("../aws");
const core_1 = require("../../aws/core");
exports.deployCore = () => __awaiter(void 0, void 0, void 0, function* () {
    const noCert = process.argv.find(arg => arg.toLowerCase().includes("nocert"));
    const deployCert = !!noCert ? false : true;
    const template = yield core_1.buildCoreTemplate(deployCert);
    const StackName = template.Description;
    if (deployCert) {
        console.log(`
>>> CREATING SSL CERT

Creating stack with SSL certificate, ensure you have setup your name servers to point to route53 already.

In the cloudformation logs > events tab you will see the content of the DNS record you will need to create
in order for the certificate to be issued.  Once you see that,  enter the information into a CNAME record
and then wait for the stack to finish updating.

>>>
`);
    }
    const params = {
        StackName,
        TemplateBody: cloudform_1.default(template),
        Capabilities: ["CAPABILITY_NAMED_IAM"]
    };
    yield aws_1.handleStackCreateAndUpdate(params);
});
