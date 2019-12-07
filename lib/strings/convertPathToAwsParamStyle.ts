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