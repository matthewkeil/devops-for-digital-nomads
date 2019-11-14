require("dotenv").config();

import fs from "fs";
import {
    exec,
    createCacheInvalidation,
    getLocalGitBranch,
    getDomaintName,
    bucketExists,
    emptyBucket,
    handleStackCreateAndUpdate,
    pascalCaseDomainName,
    getAbsolutePathFromRootRelativePath,
    uploadDirectory
} from "./utils";
import { config } from "../config";
import { clientTemplate } from "../aws/client";

export const deployClient = async () => {
    const branch = getLocalGitBranch();
    console.log(`deploying current git branch: ${branch}`);

    let rebuild = false;
    if (process.argv.find(arg => arg.includes("build"))) {
        rebuild = true;
    }

    let buildPromise: Promise<void | string> = Promise.resolve();
    if (
        rebuild ||
        !fs.existsSync(getAbsolutePathFromRootRelativePath("client/dist"))
    ) {
        console.log('rebuilding client repo using "npm run build -- prod"');
        buildPromise = exec("cd client && export NODE_ENV=production && npm run build");
    }

    // make sure bucket exists, if not build stack with bucket and routing
    const Bucket = getDomaintName({
        branch,
        domain: config.ROOT_DOMAIN
    });

    let bucketPromise: Promise<void>;
    if (await bucketExists({ Bucket })) {
        console.log(`found existing artifacts bucket`);

        bucketPromise = emptyBucket({ Bucket });
    } else {
        console.log(`building bucket and dns routing stack for ${Bucket}`);
        const StackName = `client-${pascalCaseDomainName(Bucket)}`;
        const TemplateBody = clientTemplate({ branch, StackName });

        bucketPromise = handleStackCreateAndUpdate({
            StackName,
            TemplateBody
        });
    }

    await Promise.all([bucketPromise, buildPromise]);

    await uploadDirectory({ Bucket, localPath: "client/dist" });

    await createCacheInvalidation({ Bucket });
};
