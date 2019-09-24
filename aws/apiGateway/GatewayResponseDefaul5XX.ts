import { ApiGateway, Fn } from "cloudform";

export const GatewayResponseDefaul5XX = new ApiGateway.GatewayResponse({
    RestApiId: Fn.Ref("ApiGateway"),
    ResponseType: "DEFAULT_5XX",
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
        "application/json": '{\n  "message": "testing 123...."\n}'
    }
}).dependsOn("ApiGateway");
