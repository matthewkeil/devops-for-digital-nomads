import path from "path";
import fs from "fs";
import { getAbsolutePathFromRootRelativePath } from "../utils";

const samlDirectory = getAbsolutePathFromRootRelativePath("server/dist");

const samlName = path.join(samlDirectory, "saml.yml");

export const saveSaml = (template: string) => {
    if (!fs.existsSync(samlDirectory)) {
        fs.mkdirSync(samlDirectory);
    }

    fs.writeFileSync(
        samlName,
        require("json2yaml").stringify(JSON.parse(template))
    );
};
