import path from "path";
import { Configuration } from "webpack";

const pkgJson = require("./package.json");
const config: Configuration = {
    entry: path.resolve(__dirname, "index.ts"),
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    output: {
        filename: "devops.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ]
            }
        ]
    },
    externals: {
        "child_process": "child_process",
        "fs": "fs"
    },
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            "@config": path.resolve(__dirname, "config"),
            "@lib": path.resolve(__dirname, "lib")
        }
    }
};

for (const dependency in pkgJson.dependencies) {
    config.externals[dependency] = dependency;
}

export default config;
