import * as PATH from "path";

export const getAbsolutePathFromRootRelativePath = (
    path: string | string[]
) => {
    const segments = Array.isArray(path)
        ? path
        : path.split("/").filter(segment => !!segment);

    return PATH.resolve(__dirname, "..", "..", ...segments);
};
