import { APIGatewayEvent, Callback } from "aws-lambda";
import { StatusCode } from "../interfaces/HttpStatusCode";
import { config } from "../../config";

export const lambdaWrapper = handler => async (
    event: APIGatewayEvent,
    callback: Callback
): Promise<void> => {
    try {
        const parameters = {};
        if (event.pathParameters) {
            Object.entries(event.pathParameters).forEach(
                ([param, value]) => (parameters[param] = decodeURIComponent(value as string))
            );
        }
        let requestBody = {};
        try {
            if (event.body && event.body !== "") {
                requestBody = JSON.parse(event.body);
            }
        } catch (err) {
            console.error("JSON.parse failed on request body");
        }
        const { body, headers = {}, statusCode = 200, isBase64Encoded = false } = await handler({
            parameters,
            headers: event.headers,
            body: requestBody
        });
        headers["Access-Control-Allow-Origin"] = "*";
        callback(null, {
            body: !body || typeof body === "string" ? body : JSON.stringify(body),
            headers,
            statusCode,
            isBase64Encoded
        });
    } catch (err) {
        callback(null, {
            stausCode: StatusCode.INTERNAL_SERVER_ERROR,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            isBase64Encoded: false,
            body: JSON.stringify(!config.PROD ? err : { message: err.message })
        });
    }
};
