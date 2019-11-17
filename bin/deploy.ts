import { deployCore } from "./deployCore";
import { deployClient } from "./deployClient";
import { deployServer } from "./deployServer";

/**
 *
 * IIFE for async and we're off!!
 *
 */
(async () => {
    const findStack = process.argv.find(arg => {
        const ARG = arg.toLowerCase();

        if (
            ARG.includes("core") ||
            ARG.includes("server") ||
            ARG.includes("client")
        ) {
            return true;
        }
    });

    const stack = !!findStack ? findStack.toLowerCase() : process.argv[2];

    switch (stack) {
        case "core":
            await deployCore();
            break;
        case "client":
            await deployClient();
            break;
        case "server":
            await deployServer();
            break;
        default:
            const message = `${stack} is not a valid stack name`;
            throw new Error(message);
    }
})();
