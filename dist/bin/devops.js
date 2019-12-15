#!/usr/bin/env node
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
const deployCore_1 = require("../lib/deployment/deployCore");
const deployClient_1 = require("../lib/deployment/deployClient");
const deployServer_1 = require("../lib/deployment/deployServer");
/**
 *
 * IIFE for async and we're off!!
 *
 */
(() => __awaiter(void 0, void 0, void 0, function* () {
    const findStack = process.argv.find(arg => {
        const ARG = arg.toLowerCase();
        if (ARG.includes("core") || ARG.includes("server") || ARG.includes("client")) {
            return true;
        }
    });
    const stack = !!findStack ? findStack.toLowerCase() : process.argv[2];
    switch (stack) {
        case "core":
            yield deployCore_1.deployCore();
            break;
        case "client":
            yield deployClient_1.deployClient();
            break;
        case "server":
            yield deployServer_1.deployServer();
            break;
        default:
            const message = `${stack} is not a valid stack name`;
            throw new Error(message);
    }
}))();
