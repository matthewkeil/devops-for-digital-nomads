require("dotenv").config();

import CF, { Fn } from "cloudform";
import { handleStackCreateAndUpdate, pascalCaseDomainName } from "./utils";
import { config } from "../config";
import { coreTemplate } from "../aws/core";
import { Certificate } from "../aws/certificateManager/Certificate";

export const deployCore = async () => {
    const noCert = process.argv.find(arg =>
        arg.toLowerCase().includes("nocert")
    );
    const deployCert = !!noCert ? false : true;
    const StackName = coreTemplate.Description;

    if (deployCert) {
        // add certificate information
        console.log(`
>>> CREATING SSL CERT

Creating stack with SSL certificate, ensure you have setup your name servers to point to route53 already.

In the cloudformation logs > events tab you will see the content of the DNS record you will need to create
in order for the certificate to be issued.  Once you see that,  enter the information into a CNAME record
and then wait for the stack to finish updating.

>>>
`);
        (coreTemplate.Resources as any).Certificate = Certificate;
        (coreTemplate.Outputs as any).Certificate = {
            Description: `SSL Certificate covering *.${config.ROOT_DOMAIN}`,
            Value: Fn.Ref("Certificate"),
            Export: {
                Name: `${pascalCaseDomainName(config.ROOT_DOMAIN)}Certificate`
            }
        };
    }

    const TemplateBody = CF(coreTemplate);
    const params: AWS.CloudFormation.CreateStackInput = {
        StackName,
        TemplateBody,
        Capabilities: ["CAPABILITY_NAMED_IAM"]
    };

    await handleStackCreateAndUpdate(params);
};
