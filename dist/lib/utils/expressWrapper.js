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
const config_1 = require("../../config");
exports.nodeWrapper = handler => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield handler({
            body: req.body,
            parameters: req.params,
            headers: req.headers
        });
        if (response.headers) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            Object.entries(response.headers).forEach(([name, value]) => res.setHeader(name, value));
        }
        if (response.statusCode) {
            res.status(response.statusCode);
        }
        else {
            res.status(200);
        }
        if (response.body) {
            res.json(response.body);
        }
        else {
            res.send();
        }
    }
    catch (err) {
        if (!config_1.config.PROD) {
            console.error(err);
        }
        res.status(500).json(!config_1.config.PROD ? err : { error: { message: "unexpected server error" } });
        next(err);
    }
});
