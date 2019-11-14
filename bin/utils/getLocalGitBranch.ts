import childProcess from "child_process";

export const getLocalGitBranch = () => {
    const output = childProcess.execSync("git status");
    const results = /^On\sbranch\s([\S]*).*/.exec(output.toString());

    if (!results) {
        throw new Error("Cannot determine what branch you are on");
    }

    return results[1];
};
