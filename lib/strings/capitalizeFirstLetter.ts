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

    return input[0].toUpperCase() + input.slice(1);
};