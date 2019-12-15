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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __importDefault(require("child_process"));
exports.exec = (command, logToConsole = false) => new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
    const stdoutHandler = (data) => {
        if (logToConsole)
            console.log(data);
    };
    const stderrHandler = (data) => {
        if (logToConsole)
            console.error(data);
    };
    const child = child_process_1.default.exec(command, (err, results) => {
        if (err)
            return reject(err);
        resolve(results);
    });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    child.stdout.on("data", stdoutHandler);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    child.stderr.on("data", stderrHandler);
    child.once("exit", () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        child.stdout.removeListener("data", stdoutHandler);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        child.stderr.removeListener("data", stderrHandler);
    });
}));
