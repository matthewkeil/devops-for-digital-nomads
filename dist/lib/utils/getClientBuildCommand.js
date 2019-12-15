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
const getPackageJson_1 = require("../fs/getPackageJson");
exports.getClientBuildCommand = () => __awaiter(void 0, void 0, void 0, function* () {
    const pkg = yield getPackageJson_1.getPackageJson("client");
    const dependencies = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies));
    const framework = new Set();
    dependencies.forEach(dependency => {
        if (dependency.includes("@angular/core")) {
            console.log("found angular project in client folder");
            framework.add("angular");
        }
        if (dependency.includes("@vue/cli-service")) {
            console.log("found vue project in client folder");
            framework.add("vue");
        }
        if (dependency.includes("react-scripts")) {
            console.log("found react project in client folder");
            framework.add("react");
        }
    });
    if (!framework.size || framework.size > 1) {
        !!framework.size
            ? console.log(`found multiple frameworks. defaulting to "npm run build"`)
            : console.log(`didn't find a framework. defaulting to "npm run build"`);
        return "npm run build";
    }
    if (framework.has("vue") || framework.has("react")) {
        return "npm run build";
    }
    if (framework.has("angular")) {
        return "npm run build -- prod";
    }
});
