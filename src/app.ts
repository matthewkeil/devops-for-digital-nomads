import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import { allowedMethods, nodeWrapper, Route, Method, ENV } from "./utils";
import { getHandlers, Handlers } from "./utils/buildHandlers";

const PROD = ENV.NODE_ENV === "production";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(
    cors({
        origin: PROD ? "*" : /localhost/,
        methods: allowedMethods as string[],
        credentials: true,
        allowedHeaders: [
            "Authorization",
            "Accept",
            "Content-Type",
            "DNT",
            "Viewport-Width",
            "Width"
        ]
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

if (PROD) {
    app.use(compression());
}

let stack: {
    [path: string]: { [method in Method]: Route };
} = {};

const parsehandlers = (segment: Handlers): void =>
    Object.values(segment).forEach(segmentOrRoute => {
        if (
            segmentOrRoute.handler &&
            typeof segmentOrRoute.handler === "function"
        ) {
            const NAME = segmentOrRoute.name;
            const METHOD = segmentOrRoute.method.toLowerCase();
            const PATH = segmentOrRoute.path as string;
            const HANDLER = nodeWrapper(segmentOrRoute.handler);

            const PATH_NO_PARAMS = PATH.split("/")
                .map(seg => (seg.startsWith(":") ? ":" : seg))
                .join("/");

            if (stack[PATH_NO_PARAMS]) {
                Object.keys(stack[PATH_NO_PARAMS]).forEach(method => {
                    if (stack[PATH_NO_PARAMS][method].path !== PATH) {
                        throw new Error(
                            `\n>>>\n>>> parameter conlict with route ${NAME} and ${stack[PATH_NO_PARAMS][method].name}\n>>>\n>>>`
                        );
                    }
                });

                if (stack[PATH_NO_PARAMS][METHOD]) {
                    throw new Error(
                        `\n>>>\n>>> cannot load ${NAME} to ${METHOD.toUpperCase()} ${PATH}.\n>>> ${
                            stack[PATH][METHOD].name
                        } is already loaded there\n>>>\n>>>`
                    );
                }
            }

            if (!stack[PATH_NO_PARAMS]) {
                stack[PATH_NO_PARAMS] = {} as any;
            }

            stack[PATH_NO_PARAMS][METHOD] = segmentOrRoute;

            // console.log(`loading ${METHOD.toUpperCase()} handler ${NAME} at ${PATH}`);
            // @ts-ignore
            return app[METHOD](PATH, HANDLER);
        }

        // recursively parse as a path segment
        return parsehandlers(segmentOrRoute);
    });

const handlers = getHandlers();

parsehandlers(handlers);

console.log(stack);

if (require.main === module) {
    app.listen(ENV.APP_PORT, () => {
        console.log("\n\nlistening on port", ENV.APP_PORT);
    });
}
