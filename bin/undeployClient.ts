// if (require.main === module) {
//     require("dotenv").config();
// }

// import { checkBranchExistsOnGithub, deleteStack } from "./utils";

// /**
//  *
//  * variable declarations
//  *
//  */
// let repo: string;
// let branch: string;

// /**
//  *
//  * handle cli input for deploy command
//  * run command with `npm run undeploy <branch>`
//  * if no branch is provided will us current local
//  * branch
//  *
//  */
// const processArgv = async () => {
//     const info = await checkBranchExistsOnGithub();
//     repo = info.repo;
//     branch = process.argv[2];

//     if (!branch) {
//         branch = info.branch;
//     }
// }

// /**
//  *
//  * IIFE for async and we're off!!
//  *
//  */
// (async () => {
//     await processArgv();
//     const StackName = `${repo}-${branch}`;

//     console.log(`attempting to remove ${StackName}`);
//     await deleteStack({ StackName });
// })();
