import path from "path";
import childProcess from "child_process";
import Octokit from "@octokit/rest";

export const FROM_ROOT = (...segments: string[]) =>
    path.resolve(__dirname, "..", "..", ...segments);

export const capitalizeFirstLetter = (input: string = ""): string => {
    if (typeof input !== "string" || input === "") {
        throw new Error("must supply a valid string");
    }

    // look for kebab-case and recursively capitalize first letter
    if (input.indexOf("-") !== -1) {
        const words = input.split("-");

        const capitalized = words.map(word => capitalizeFirstLetter(word));

        return capitalized.join("");
    }

    // const str = input.toLowerCase();
    return input[0].toUpperCase() + input.slice(1);
};

export const convertPathToAwsParamStyle = (path: string) => {
    const segments = path.startsWith("/")
        ? path.slice(1).split("/")
        : path.split("/");

    const updated = segments.map(segment => {
        if (segment.startsWith(":")) {
            return "{" + segment.slice(1) + "}";
        }
        return segment;
    });

    return "/" + updated.join("/");
};

export const exec = (command: string, logToConsole = false) =>
    new Promise(async (resolve, reject) => {
        const stdoutHandler = (data: string) => {
            if (logToConsole) console.log(data);
        };

        const stderrHandler = (data: string) => {
            if (logToConsole) console.error(data);
        };

        const child = childProcess.exec(command, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        child.stdout!.on("data", stdoutHandler);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        child.stderr!.on("data", stderrHandler);

        child.once("exit", () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            child.stdout!.removeListener("data", stdoutHandler);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            child.stderr!.removeListener("data", stderrHandler);
        });
    });

/**
 *
 * github branch validation.
 * verifies local working branch exists on github and return name or throws error
 *
 */
export const checkBranchExistsOnGithub = async ({
    owner,
    repo
}: {
    owner: string;
    repo: string;
}) => {
    const output = childProcess.execSync("git status");

    const results = /^On\sbranch\s([\S]*).*/.exec(output.toString());

    if (!results) {
        throw new Error("Cannot determine what branch you are on");
    }

    const localBranch = results[1];

    const octokit = new Octokit({
        auth: process.env.GITHUB_ACCESS_TOKEN
    });

    const branches = await octokit.repos.listBranches({
        owner,
        repo
    });

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
