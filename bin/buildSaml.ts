import template from "../aws/api";
import { saveSaml } from "./utils";

const BRANCH = process.argv[2];

saveSaml(template(BRANCH));
