const cp = require("child_process");

let build;
let nodemon;

const firstRun = cp.exec(
    "npm run build:dev",
    (err, _, stderr) => {
        if (err) {
            console.error(stderr);
            process.exit(1);
        }

        build = cp.exec("npm run build:watch");
        build.stdout.pipe(process.stdout);
        build.stderr.pipe(process.stderr);

        nodemon = cp.exec("npm run nodemon");
        nodemon.stdout.pipe(process.stdout);
        nodemon.stderr.pipe(process.stderr);

        process.stdin.pipe(nodemon.stdin);
    }
);

firstRun.stdout.pipe(process.stdout);

process.on("SIGINT", () => {
    if (build && !build.killed) {
        build.kill();
    }

    if (nodemon && !nodemon.killed) {
        nodemon.kill();
    }

    if (firstRun && !firstRun.killed) {
        firstRun.kill();
    }

    process.exit();
});
