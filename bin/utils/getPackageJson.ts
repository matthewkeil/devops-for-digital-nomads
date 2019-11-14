import fs from "fs";
import util from "util";
import path from "path";

const exists = util.promisify(fs.exists);

export const getPackageJson = async (folder: "client" | "server") => {
    const clientPkgLocation = path.resolve(
        __dirname,
        "..",
        "..",
        folder,
        "package.json"
    );

    if (!(await exists(clientPkgLocation))) {
        throw new Error(
            `could not locate a package.json in your ${folder} folder`
        );
    }

    return require(clientPkgLocation);
};
