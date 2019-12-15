import fs from "fs";
import { lookup } from "mime-types";
import { config } from "../../../config";

const { S3 } = config;

interface UploadFileProps {
    Bucket: string;
    Key: string;
    path: string;
}

export const uploadFile = async ({ Bucket, Key, path }: UploadFileProps) => {
    const contentType = lookup(Key);

    const response = await S3.upload({
        Bucket,
        Key,
        ACL: "public-read",
        ContentEncoding: "utf-8",
        ContentType: contentType ? contentType : "application/octet-stream",
        Body: fs.createReadStream(path, { autoClose: true })
    }).promise();

    return response;
};
