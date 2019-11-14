import { getAbsolutePathFromRootRelativePath } from "../helpers";
import { walkDirectory } from "./walkDirectory";

interface UploadDirectoryParams {
    localPath: string; // path to upoad, relative to repo root
    uploadPath?: string; // directory to upload into, defaults to root
    Bucket: string;
}

export const uploadDirectory = async ({
    localPath,
    uploadPath,
    Bucket
}: UploadDirectoryParams) => {
    const path = getAbsolutePathFromRootRelativePath(localPath);

    // ensure that teh keyBase starts with a '/'. this is necessary
    // for the recursive walkDirectory function and the leading '/'
    // will be removed from the final objcet Prefix so a blank diretory
    // is not created.
    const keyBase =
        uploadPath === "/" || !uploadPath
            ? "/"
            : uploadPath.startsWith("/")
            ? uploadPath
            : "/".concat(uploadPath);

    await walkDirectory({ Bucket, path, keyBase });

    console.log(`finished uploading dist / to ${Bucket}`);
};
