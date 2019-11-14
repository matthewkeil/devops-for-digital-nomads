require("dotenv").config();

import CF from "cloudform";
import { handleStackCreateAndUpdate } from "./aws";
import { buildCoreTemplate } from "../aws/core";

export const deployCore = async () => {
    const noCert = process.argv.find(arg =>
        arg.toLowerCase().includes("nocert")
    );
    const deployCert = !!noCert ? false : true;

    const template = await buildCoreTemplate(deployCert);
    const StackName = template.Description;

    if (deployCert) {
        console.log(`
>>> CREATING SSL CERT

Creating stack with SSL certificate, ensure you have setup your name servers to point to route53 already.

In the cloudformation logs > events tab you will see the content of the DNS record you will need to create
in order for the certificate to be issued.  Once you see that,  enter the information into a CNAME record
and then wait for the stack to finish updating.

>>>
`);
    }

    const params: AWS.CloudFormation.CreateStackInput = {
        StackName,
        TemplateBody: CF(template),
        Capabilities: ["CAPABILITY_NAMED_IAM"]
    };

    await handleStackCreateAndUpdate(params);
};
