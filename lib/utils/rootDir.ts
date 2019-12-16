import path from "path";

let ROOT_DIR: string;

const getRootDir = () => {
    const pathSegments = module.filename.split("/node_modules");
    const isPackage = pathSegments.length > 1 && pathSegments[1].startsWith("/nomad-devops");
    return isPackage
        ? pathSegments[0]
        : module.filename.split("/nomad-devops")[0].concat("/nomad-devops");
};

export const fromRoot = (pathOrSegments: string | string[], ...rest: string[]) => {
    if (!ROOT_DIR) {
        ROOT_DIR = getRootDir();
    }
    const segments = Array.isArray(pathOrSegments)
        ? pathOrSegments
        : pathOrSegments.startsWith("/")
        ? pathOrSegments.substring(1).split("/")
        : pathOrSegments.split("/");

    return path.resolve(ROOT_DIR, ...(rest ? [...segments, ...rest] : segments));
};
