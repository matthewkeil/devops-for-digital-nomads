require("dotenv").config();

import fs from "fs";
import {
    exec,
    getLocalGitBranch,
    getArtifactsBucketName,
    getAbsolutePathFromRootRelativePath,
    getStackName
} from "../utils";
import { buildServerTemplate } from "../../aws/server";
import { saveSaml, bucketExists, createBucketWithFolders } from "../aws";
import { config } from "../../config";

export const deployServer = async () => {
    const branch = getLocalGitBranch();
    console.log(`deploying current git branch: ${branch}`);

    let rebuild = false;
    if (process.argv.find(arg => arg.includes("build"))) {
        rebuild = true;
    }

    const serverDistLocation = "server/dist";
    let buildPromise: Promise<void | string> = Promise.resolve();
    if (
        rebuild ||
        !fs.existsSync(getAbsolutePathFromRootRelativePath(serverDistLocation))
    ) {
        const command = "npm run build:prod";
        console.log(`rebuilding server repo using "${command}"`);
        buildPromise = exec(
            `cd server && export NODE_ENV=production && ${command}`
        );
    }

    const domain = config.ROOT_DOMAIN;
    const Bucket = getArtifactsBucketName({ domain, branch });

    console.log(Bucket);
    // let bucketPromise: Promise<any> = Promise.resolve();
    // if (!await bucketExists({ Bucket })) {
    //     bucketPromise = createBucketWithFolders({ Bucket });
    // }

    // const StackName = getStackName({ branch, domain, stack: 'server' });
    // const TemplateBody = buildServerTemplate({ branch, StackName });

    // console.log("saving saml.yml to /dist");
    // saveSaml(TemplateBody);

    // await Promise.all([buildPromise, bucketPromise]);

    // // package code and put in bucket
    // console.log(`packaging and uploading code to ${Bucket}`);
    // await exec(
    //     `aws cloudformation package --template-file ${serverDistLocation}/saml.yml --output-template-file ${serverDistLocation}/cloudformation.yml --s3-bucket ${Bucket}`
    // );

    // // deploy stack
    // console.log("deploying code");
    // await exec(
    //     `aws cloudformation deploy --template-file ${serverDistLocation}/cloudformation.yml --stack-name ${StackName} --capabilities CAPABILITY_NAMED_IAM --parameter-overrides GitHubBranch=${branch}`
    // );
};
