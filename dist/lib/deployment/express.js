"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const config_1 = require("../../config");
const app = express_1.default();
app.use(morgan_1.default("dev"));
app.use(helmet_1.default());
app.use(cors_1.default({
    origin: !config_1.config.PROD ? /localhost/ : config_1.config.CORS ? `*.${config_1.config.ROOT_DOMAIN}` : "*",
    methods: config_1.config.ALLOWED_METHODS,
    credentials: true,
    allowedHeaders: [
        "Authorization",
        "Accept",
        "Content-Type",
        "DNT",
        "Viewport-Width",
        "Width"
    ]
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
if (config_1.config.PROD) {
    app.use(compression_1.default());
}
// let stack: {
//     [path: string]: { [method in Method]: Route };
// } = {};
// const parsehandlers = (segment: Handlers): void =>
//     Object.values(segment).forEach(segmentOrRoute => {
//         if (
//             segmentOrRoute.handler &&
//             typeof segmentOrRoute.handler === "function"
//         ) {
//             const NAME = segmentOrRoute.name;
//             const METHOD = segmentOrRoute.method.toLowerCase();
//             const PATH = segmentOrRoute.path as string;
//             const HANDLER = nodeWrapper(segmentOrRoute.handler);
//             const PATH_NO_PARAMS = PATH.split("/")
//                 .map(seg => (seg.startsWith(":") ? ":" : seg))
//                 .join("/");
//             if (stack[PATH_NO_PARAMS]) {
//                 Object.keys(stack[PATH_NO_PARAMS]).forEach(method => {
//                     if (stack[PATH_NO_PARAMS][method].path !== PATH) {
//                         throw new Error(
//                             `\n>>>\n>>> parameter conlict with route ${NAME} and ${
//                                 stack[PATH_NO_PARAMS][method].name
//                             }\n>>>\n>>>`
//                         );
//                     }
//                 });
//                 if (stack[PATH_NO_PARAMS][METHOD]) {
//                     throw new Error(
//                         `\n>>>\n>>> cannot load ${NAME} to ${METHOD.toUpperCase()} ${PATH}.\n>>> ${
//                             stack[PATH][METHOD].name
//                         } is already loaded there\n>>>\n>>>`
//                     );
//                 }
//             }
//             if (!stack[PATH_NO_PARAMS]) {
//                 stack[PATH_NO_PARAMS] = {} as any;
//             }
//             stack[PATH_NO_PARAMS][METHOD] = segmentOrRoute;
//             // console.log(`loading ${METHOD.toUpperCase()} handler ${NAME} at ${PATH}`);
//             // @ts-ignore
//             return app[METHOD](PATH, HANDLER);
//         }
//         // recursively parse as a path segment
//         return parsehandlers(segmentOrRoute);
//     });
// const handlers = getHandlers();
// parsehandlers(handlers);
// console.log(stack);
if (require.main === module) {
    app.listen(3001, () => {
        console.log("\n\nlistening on port 3001");
    });
}
