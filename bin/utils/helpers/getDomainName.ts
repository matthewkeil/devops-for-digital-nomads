export const getDomaintName = ({
    branch,
    domain
}: {
    branch: string;
    domain: string;
}) => {
    let _branch = branch;

    if (branch === "master") {
        _branch = "www";
    }
    return `${_branch}.${domain}`;
};
