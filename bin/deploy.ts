require("dotenv").config();

import fs from "fs";
import path from "path";
import AWS from "aws-sdk";
import {
    exec,
    saveSaml,
    getArtifactsBucket,
    Status,
    getStackStatus,
    deleteStack,
    createStack,
    updateStack,
    checkBranchExistsOnGithub
} from "./utils";

/**
 *
 * project constants
 *
 */
const owner = "flomio";
const repo = "passninja-api";

/**
 *
 * variable declarations
 *
 */
let branch!: string;
let stack!: "DEVOPS" | "API" | "DB";
let TemplateBody!: string;
let artifactsBucket!: string;
let StackName!: string;

/**
 *
 * handle cli input for deploy command
 *
 */
const processArgv = async () => {
    branch = await checkBranchExistsOnGithub({
        owner,
        repo
    });

    if (process.argv[2] === "build" || process.argv[2] === "prod") {
        process.argv[3] = process.argv[2];
        stack = "API";
    } else {
        stack = (process.argv[2] || "api").toUpperCase() as any;
    }

    /**
     *
     * looks for build keyword and rebuilds with tsc
     * if 'prod' is provided it will delete the dist/
     * and also reinstall with npm run install
     *
     */

    if (process.argv[3] === "build") {
        console.log("running build:dev");
        await exec("npm run build:dev");
    } else if (process.argv[3] === "prod") {
        console.log("running build:prod");
        await exec("npm run build:prod");
    }

    if (!fs.existsSync(path.resolve(__dirname, "..", "dist", "node_modules"))) {
        console.log("node_modules not found in dist, building...");
        await exec("npm run install:prod");
    }
};

/**
 *
 * manually deploy api.
 * note: must have existing pipeling to avoid conflicts with creating the artifacts bucket
 *
 */
const deployApi = async () => {
    console.log("saving saml.yml to /dist");
    saveSaml(TemplateBody);

    // package code and put in bucket
    console.log("packaging and uploading code");
    await exec(
        `aws cloudformation package --template-file dist/saml.yml --output-template-file dist/cloudformation.yml --s3-bucket ${artifactsBucket}`
    );

    // deploy stack
    console.log("deploying code");
    await exec(
        `aws cloudformation deploy --template-file dist/cloudformation.yml --stack-name ${StackName} --capabilities CAPABILITY_NAMED_IAM --parameter-overrides GitHubBranch=${branch}`
    );
};

const buildParameters = (status: "create" | "update") => {
    const params: AWS.CloudFormation.CreateStackInput = {
        StackName,
        TemplateBody
    };

    if (stack === "DB") {
        return params;
    }

    params.Capabilities = ["CAPABILITY_NAMED_IAM"];

    if (status === "create") {
        params.Parameters = [
            {
                ParameterKey: "GitHubBranch",
                ParameterValue: branch
            }
        ];

        return params;
    }

    params.Parameters = [
        {
            ParameterKey: "GitHubBranch",
            UsePreviousValue: true
        }
    ];

    return params as AWS.CloudFormation.UpdateStackInput;
};

/**
 *
 * Cloudformation does not allow some stack states to be updated and thus
 * the stack must be deleted and recreated. First checks to see if stack exists,
 * if not creates it. If stack exists check status to see if can be updated, if
 * not, delete and recreate. If no issues go ahead and upadte the stack.
 *
 */
const handleStack = async () => {
    // prettier-ignore
    let params: AWS.CloudFormation.CreateStackInput | AWS.CloudFormation.UpdateStackInput;

    const status = await getStackStatus(StackName);

    switch (status) {
        // no status means stack doesn't exist
        case undefined:
            console.log(`${StackName} doest not exist, creating it`);
            params = buildParameters("create");
            await createStack(params);
            break;

        // cases where delete must happen first
        case Status.ROLLBACK_COMPLETE:
        case Status.ROLLBACK_FAILED:
        case Status.UPDATE_ROLLBACK_FAILED:
        case Status.CREATE_FAILED:
            if (stack === "DB") {
                // prevents accidental deletion of the dbase stack
                throw new Error(
                    "dbase stack in failed state and cannot be updated, call the admin"
                );
            }

            console.log(`${StackName} is in a failed state. deleting first`);
            await deleteStack({ StackName });

            console.log("delete complete. rebuilding stack");
            params = buildParameters("create");
            await createStack(params);
            break;

        // cases where ready for update
        default:
            if (stack === "DB") {
                /**
                 * eventually check to see what needs to be updated and only allow
                 * updates that will not recreate the database and thus destroy all
                 */
                throw new Error("dbase stack must be updated by the admin");
            }

            params = buildParameters("update");
            return await updateStack(params);
    }
};

/**
 *
 * IIFE for async and we're off!!
 *
 */
(async () => {
    await processArgv();

    artifactsBucket = await getArtifactsBucket({ repo, branch });

    switch (stack) {
        case "DEVOPS":
            TemplateBody = require("../aws/devops").default({ repo, branch });
            break;
        case "DB":
            TemplateBody = require("../aws/db").default(branch);
            break;
        case "API":
        default:
            TemplateBody = require("../aws/api").default(branch);
            break;
        // throw new Error(
        //     'incorrect stack supplied to "npm run deploy <stack> <branch>". stack must be "devops" or "api" or "db"'
        // );
    }

    StackName = JSON.parse(TemplateBody).Description;

    if (stack === "API") {
        return await deployApi();
    }

    await handleStack();
})();
