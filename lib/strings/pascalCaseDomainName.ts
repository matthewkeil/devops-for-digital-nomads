export const camelCaseDomainName = (domain: string) =>
    domain
        .split(".")
        .map((segment, index) => {
            if (index !== 0) {
                return segment[0].toUpperCase() + segment.substr(1);
            }

            return segment;
        })
        .join("");

export const pascalCaseDomainName = (domain: string) =>
    domain
        .split(".")
        .map(segment => segment[0].toUpperCase() + segment.substr(1))
        .join("");
