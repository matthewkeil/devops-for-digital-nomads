import { getPackageJson } from "./getPackageJson";

export const getClientBuildCommand = async () => {
    const pkg = await getPackageJson("client");
    const dependencies = Object.keys(pkg.dependencies || {}).concat(
        Object.keys(pkg.devDependencies)
    );
    const framework = new Set<string>();

    dependencies.forEach(dependency => {
        if (dependency.includes("@angular/core")) {
            console.log("found angular project in client folder");
            framework.add("angular");
        }

        if (dependency.includes("@vue/cli-service")) {
            console.log("found vue project in client folder");
            framework.add("vue");
        }

        if (dependency.includes("react-scripts")) {
            console.log("found react project in client folder");
            framework.add("react");
        }
    });

    if (!framework.size || framework.size > 1) {
        !!framework.size
            ? console.log(
                  `found multiple frameworks. defaulting to "npm run build"`
              )
            : console.log(
                  `didn't find a framework. defaulting to "npm run build"`
              );
        return "npm run build";
    }

    if (framework.has("vue") || framework.has("react")) {
        return "npm run build";
    }

    if (framework.has("angular")) {
        return "npm run build -- prod";
    }
};
