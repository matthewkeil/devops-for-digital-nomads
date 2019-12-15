// import fs from "fs";
// import path from "path";
// import { Route } from "../interfaces";
// export interface RouteWithName extends Route {
//     name: string;
// }
// export interface Handlers {
//     [name: string]: RouteWithName | Handlers;
// }
// export const FROM_SERVER_ROOT = (...segments: string[]) =>
//     path.resolve(__dirname, "..", "..", ...segments);
// const parseDirectory = (...segments: string[]) => {
//     const handlerSegment: Handlers = {};
//     const directoryToLookIn = FROM_SERVER_ROOT(...segments);
//     const objectsInDirectory = fs.readdirSync(directoryToLookIn);
//     Object.values(objectsInDirectory).forEach(object => {
//         const current = path.join(directoryToLookIn, object);
//         if (fs.statSync(current).isDirectory()) {
//             return void Object.assign(handlerSegment, {
//                 [object]: parseDirectory(...segments, object)
//             });
//         }
//         // if filename contains .spec or .map it should not be included with handlers
//         if (object.includes(".spec.") || object.includes(".map")) {
//             return;
//         }
//         const fileName = current.split(".")[0];
//         const objectName = object.split(".")[0];
//         const route: RouteWithName = require(fileName)[objectName];
//         if (!route) {
//             const message = `${fileName} does not have a Route named ${objectName}. check its exports`;
//             throw new Error(message);
//         }
//         route.name = objectName;
//         Object.assign(handlerSegment, { [objectName]: route });
//     });
//     return handlerSegment;
// };
// export const getHandlers = () => parseDirectory("src", "handlers");
