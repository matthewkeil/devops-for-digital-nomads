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
const HttpStatusCode_1 = require("../interfaces/HttpStatusCode");
const config_1 = require("../../config");
exports.lambdaWrapper = handler => (event, callback) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parameters = {};
        if (event.pathParameters) {
            Object.entries(event.pathParameters).forEach(([param, value]) => (parameters[param] = decodeURIComponent(value)));
        }
        let requestBody = {};
        try {
            if (event.body && event.body !== "") {
                requestBody = JSON.parse(event.body);
            }
        }
        catch (err) {
            console.error("JSON.parse failed on request body");
        }
        const { body, headers = {}, statusCode = 200, isBase64Encoded = false } = yield handler({
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
    }
    catch (err) {
        callback(null, {
            stausCode: HttpStatusCode_1.StatusCode.INTERNAL_SERVER_ERROR,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            isBase64Encoded: false,
            body: JSON.stringify(!config_1.config.PROD ? err : { message: err.message })
        });
    }
});
