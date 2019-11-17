import { ApiGateway, Fn } from "cloudform";

export const GatewayResponseDefault5XX = new ApiGateway.GatewayResponse({
    RestApiId: Fn.Ref("ApiGateway"),
    ResponseType: "DEFAULT_5XX",
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
