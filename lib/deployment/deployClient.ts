require("dotenv").config();

import fs from "fs";
import {
    createCacheInvalidation,
    bucketExists,
    emptyBucket,
    handleStackCreateAndUpdate,
    uploadDirectory
} from "../aws";
import { exec, getLocalGitBranch } from "../utils";
import { getDomainName, getStackName } from "../strings";
import { getAbsolutePathFromRootRelativePath } from "../fs";
import { config } from "../../config";
import { clientTemplate } from "../../aws/client";
import { getClientBuildCommand } from "../utils/getClientBuildCommand";

export const deployClient = async () => {
    const branch = getLocalGitBranch();
    console.log(`deploying current git branch: ${branch}`);

    let rebuild = false;
    if (process.argv.find(arg => arg.includes("build"))) {
        rebuild = true;
    }

    const clientDistLocation = "client/dist";
    let buildPromise: Promise<void | string> = Promise.resolve();
    if (rebuild || !fs.existsSync(getAbsolutePathFromRootRelativePath(clientDistLocation))) {
        const command = getClientBuildCommand();
        console.log(`rebuilding client repo using "${command}"`);
        buildPromise = exec(`cd client && export NODE_ENV=production && ${command}`);
    }

    const domain = config.ROOT_DOMAIN;

    // make sure bucket exists, if not build stack with bucket and routing
    const Bucket = getDomainName({
        branch,
        domain
    });

    let bucketPromise: Promise<void>;
    if (await bucketExists({ Bucket })) {
        console.log(`found existing artifacts bucket`);

        bucketPromise = emptyBucket({ Bucket });
    } else {
        console.log(`building bucket and dns routing stack for ${Bucket}`);

        const StackName = getStackName({ branch, domain, stack: "client" });

        const TemplateBody = clientTemplate({ branch, StackName });

        bucketPromise = handleStackCreateAndUpdate({
            StackName,
            TemplateBody
        });
    }

    await Promise.all([bucketPromise, buildPromise]);

    await uploadDirectory({ Bucket, localPath: clientDistLocation });

    await createCacheInvalidation({ Bucket });
};
