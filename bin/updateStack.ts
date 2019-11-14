// if (require.main === module) {
//     require("dotenv").config();
// }

// import { checkBranchExistsOnGithub, handleStackCreateAndUpdate } from "./aws";

// /**
//  *
//  * IIFE for async and we're off!!
//  *
//  */
// (async function updateStack() {
//     const { repo, branch } = await checkBranchExistsOnGithub();
//     const StackName = `${repo}-${branch}`;
//     const TemplateBody = require("../aws/template").default({ repo, branch });

//     await handleStackCreateAndUpdate({
//         StackName,
//         TemplateBody
//     });
// })();
