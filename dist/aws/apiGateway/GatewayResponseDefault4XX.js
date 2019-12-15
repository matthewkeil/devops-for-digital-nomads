"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudform_1 = require("cloudform");
exports.GatewayResponseDefault4XX = new cloudform_1.ApiGateway.GatewayResponse({
    RestApiId: cloudform_1.Fn.Ref("ApiGateway"),
    ResponseType: "DEFAULT_4XX",
    ResponseParameters: {
        "gatewayresponse.header.Access-Control-Allow-Headers": "'*'",
        "gatewayresponse.header.Access-Control-Allow-Origin": "'*'"
        // Fn.Join("", [
        //     // "'*.",
        //     // Fn.ImportValue("RootDomain"),
        //     // "'"
        //     /** once cors turns on use above */
        // ]),
    },
    ResponseTemplates: {
        "application/json": '{\n  "message": $context.error.messageString\n}'
    }
}).dependsOn("ApiGateway");
