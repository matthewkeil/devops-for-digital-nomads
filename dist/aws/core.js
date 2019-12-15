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
const cloudform_1 = require("cloudform");
const config_1 = require("../config");
const lib_1 = require("../lib");
const HostedZone_1 = require("./route53/HostedZone");
const ApiGatewayAccount_1 = require("./apiGateway/ApiGatewayAccount");
const ApiGatewayPolicy_1 = require("./apiGateway/ApiGatewayPolicy");
const ApiGatewayRole_1 = require("./apiGateway/ApiGatewayRole");
const Certificate_1 = require("../aws/certificateManager/Certificate");
exports.buildCoreTemplate = (deployCert) => __awaiter(void 0, void 0, void 0, function* () {
    const template = {
        Description: `core-${lib_1.pascalCaseDomainName(config_1.config.ROOT_DOMAIN)}`,
        Parameters: {
            RootDomain: {
                Description: "Root domain at which the system is hosted.",
                Type: "String",
                Default: config_1.config.ROOT_DOMAIN
            }
        },
        Resources: {
            HostedZone: HostedZone_1.HostedZone
        },
        Outputs: {
            HostedZoneId: {
                Description: `HostedZoneId for ${config_1.config.ROOT_DOMAIN}`,
                Value: cloudform_1.Fn.Ref("HostedZone"),
                Export: {
                    Name: `${lib_1.pascalCaseDomainName(config_1.config.ROOT_DOMAIN)}HostedZone`
                }
            }
        }
    };
    if (!(yield lib_1.apiGatewayAccountExists())) {
        template.Resources.ApiGatewayAccount = ApiGatewayAccount_1.ApiGatewayAccount;
        template.Resources.ApiGatewayPolicy = ApiGatewayPolicy_1.ApiGatewayPolicy;
        template.Resources.ApiGatewayRole = ApiGatewayRole_1.ApiGatewayRole;
    }
    if (deployCert) {
        template.Resources.Certificate = Certificate_1.Certificate;
        template.Outputs.Certificate = {
            Description: `SSL Certificate covering *.${config_1.config.ROOT_DOMAIN}`,
            Value: cloudform_1.Fn.Ref("Certificate"),
            Export: {
                Name: `${lib_1.pascalCaseDomainName(config_1.config.ROOT_DOMAIN)}Certificate`
            }
        };
    }
    return template;
});
