import fs from "fs";
import util from "util";
import PATH from "path";
import { uploadFile } from "./uploadFile";

const STAT = util.promisify(fs.stat);

interface WalkDirectoryProps {
    path: string;
    keyBase: string;
    Bucket: string;
}

export const walkDirectory = async ({
    path,
    keyBase,
    Bucket
}: WalkDirectoryProps) =>
    new Promise((resolve, reject) => {
        console.log("attempting to upload " + path);

        fs.readdir(path, async (err, files) => {
            if (err) throw reject(err);

            await Promise.all(
                files.map(async object => {
                    const current = PATH.join(path, object);
                    const stat = await STAT(current);

                    if (stat.isDirectory()) {
                        return walkDirectory({
                            Bucket,
                            path: current,
                            keyBase: `${keyBase}${object}/`
                        });
                    }

                    const Key = keyBase + object;

                    return uploadFile({
                        Bucket,
                        Key: Key.slice(1),
                        path: current
                    });
                })
            );

            console.log("finished uploading " + keyBase);
            resolve();
        });
    });
