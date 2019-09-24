import { ApiGateway, Fn } from "cloudform";

export const GatewayResponseDefaul4XX = new ApiGateway.GatewayResponse({
    RestApiId: Fn.Ref("ApiGateway"),
    ResponseType: "DEFAULT_4XX",
    ResponseParameters: {
        "gatewayresponse.header.Access-Control-Allow-Origin": Fn.Join("", [
            // "'*.",
            // Fn.ImportValue("RootDomain"),
            // "'"
            /** once cors turns on use above */
            "'*'"
        ]),
        "gatewayresponse.header.Access-Control-Allow-Headers": "'*'"
    },
    ResponseTemplates: {
        "application/json": '{\n  "message": $context.error.messageString\n}'
    }
}).dependsOn("ApiGateway");
