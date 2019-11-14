import Octokit from "@octokit/rest";
import { getLocalGitBranch } from "./getLocalGitBranch";

export const checkBranchExistsOnGithub = async ({
    owner,
    repo
}: {
    owner: string;
    repo: string;
}) => {
    let branches;
    const localBranch = getLocalGitBranch();

    const octokit = new Octokit({
        auth: process.env.GITHUB_ACCESS_TOKEN
    });

    try {
        branches = await octokit.repos.listBranches({
            owner,
            repo
        });
    } catch (err) {
        if (err.name == "HttpError") {
            throw new Error(
                "GITHUB_ACCESS_TOKEN is missing from your .env file"
            );
        }
        throw err;
    }

    if (
        branches.data &&
        Array.isArray(branches.data) &&
        branches.data.findIndex((b: any) => b.name === localBranch) === -1
    ) {
        throw new Error(
            `branch ${localBranch} does not exist on ${owner}/${repo}`
        );
    }

    return localBranch;
};
