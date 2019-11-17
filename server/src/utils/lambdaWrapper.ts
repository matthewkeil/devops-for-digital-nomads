import {
    APIGatewayEvent,
    APIGatewayEventRequestContext,
    Callback
} from "aws-lambda";
import { Handler } from "../interfaces/Handler";
import { StatusCode } from "./HttpStatusCode";
import { ENV } from "./ENV";

export const lambdaWrapper = (handler: Handler) => async (
    event: APIGatewayEvent,
    context: APIGatewayEventRequestContext,
    callback: Callback
): Promise<void> => {
    try {
        const parameters = {};
        if (event.pathParameters) {
            Object.entries(event.pathParameters).forEach(
                ([param, value]) =>
                    (parameters[param] = decodeURIComponent(value))
            );
        }

        let requestBody = {};
        try {
            if (event.body && event.body !== "") {
                requestBody = JSON.parse(event.body);
            }
        } catch (err) {
            console.error("JSON.parse failed on request body");
            // console.error(err)
            // console.log("REQUEST",requestBody)
            // console.log("EVENT BODY",event.body)
        }

        const handlerParams = {
            parameters,
            headers: event.headers,
            body: requestBody
        };

        const {
            body,
            headers = {},
            statusCode = 200,
            isBase64Encoded = false
        } = await handler(handlerParams);

        headers["Access-Control-Allow-Origin"] = "*";

        const response = {
            body:
                !body || typeof body === "string" ? body : JSON.stringify(body),
            headers,
            statusCode,
            isBase64Encoded
        };

        callback(null, response);
    } catch (err) {
        callback(null, {
            stausCode: StatusCode.INTERNAL_SERVER_ERROR,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            isBase64Encoded: false,
            body: JSON.stringify(ENV.DEBUG ? err : { message: err.message })
        });
    }
};
