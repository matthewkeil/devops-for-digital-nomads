import { config } from "../../../config";
import { getLocalGitBranch } from "../../../bin";

/**
 *
 *  .env variables that must be defined at build time
 *  - ROOT_DOMAIN
 *  - REGION
 *  -
 *
 *  .env variable that are option and can be used to override (default)s
 *  - NODE_ENV ('development') localhost development only
 *  - BRANCH
 */

/**
 * NODE_ENV will be set by process variable defined in Function environment
 * or by .env on local machine.  if none is present assume developemnt
 */
const NODE_ENV = process.env.NODE_ENV || "development";
const DEV = NODE_ENV === "development";
const PROD = NODE_ENV === "production";

/**
 * the BRANCH variable is not defined in the api template so will
 * always be undefined and git does not exist on lambda so this will
 * throw an error on aws. all variable requiring branch are for local
 * development override only
 */
let branch;
if (!PROD) {
    branch = process.env.BRANCH || getLocalGitBranch();
}

/**
 * DEBUG can be undefined or a string for debug('debugNamespace');
 * is pulled from .env during localhost development
 * is defined at deployment time from .env during manual deploy and
 * passed in by api template
 * is always undefined during devops deploy
 */
const DEBUG = process.env.DEBUG;

/**
 * on aws ROOT_DOMAIN is defined by dns stack and passed in as an env variable
 * through Fn.ImportValue("RootDomain") on the Function.Environment. for local
 * development it is taken in from the .env so is required to be in .env
 */
const ROOT_DOMAIN = process.env.ROOT_DOMAIN || config.ROOT_DOMAIN;

/**
 * region will be set by the .env for local development and will also set the
 * region for deployment to aws. when deploying to aws the stack will use this
 * and pass in the Refs.Region to handlers within the region, thus aws region
 * will be set by the stack which gets set at deployment time.
 */
const REGION = process.env.REGION || config.REGION;

export const ENV = {
    NODE_ENV,
    DEV,
    PROD,
    ROOT_DOMAIN,
    REGION,
    DEBUG
};

if (!ENV.PROD) {
    console.log(ENV);
}
