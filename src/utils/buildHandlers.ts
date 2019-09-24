import fs from "fs";
import path from "path";
import { Route } from ".";

export interface RouteWithName extends Route {
    name: string;
}

export interface Handlers {
    [name: string]: RouteWithName | Handlers;
}

export const FROM_ROOT = (...segments: string[]) =>
    path.resolve(__dirname, "..", "..", ...segments);

const parseDirectory = (...segments: string[]) => {
    const handlerSegment: Handlers = {};
    const directoryToLookIn = FROM_ROOT(...segments);
    const objectsInDirectory = fs.readdirSync(directoryToLookIn);

    Object.values(objectsInDirectory).forEach(object => {
        const current = path.join(directoryToLookIn, object);

        if (fs.statSync(current).isDirectory()) {
            return void Object.assign(handlerSegment, {
                [object]: parseDirectory(...segments, object)
            });
        }

        const fileName = current.split(".")[0];
        const objectName = object.split(".")[0];
        const route: RouteWithName = require(fileName)[objectName];
        route.name = objectName;

        Object.assign(handlerSegment, { [objectName]: route });
    });

    return handlerSegment;
};

export const getHandlers = () => parseDirectory("dist", "handlers");
