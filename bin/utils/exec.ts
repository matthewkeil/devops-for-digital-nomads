import childProcess from "child_process";

export const exec = (command: string, logToConsole = false) =>
    new Promise<string>(async (resolve, reject) => {
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
