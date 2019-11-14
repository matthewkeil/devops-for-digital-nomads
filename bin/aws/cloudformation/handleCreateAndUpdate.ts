import AWS from "aws-sdk";
import { StackStatus } from "./StackStatus";
import { getStackStatus } from "./getStatus";
import { createStack } from "./createStack";
import { updateStack } from "./updateStack";
import { deleteStack } from "./deleteStack";
import { getStackEvents } from "./getStackEvents";
import { createCertRecordSet } from "../route53/createCertRecordSet";

export const handleStackCreateAndUpdate = async (
    params:
        | AWS.CloudFormation.CreateStackInput
        | AWS.CloudFormation.UpdateStackInput
) => {
    /**
     *
     * Cloudformation does not allow some stack states to be updated and thus
     * the stack must be deleted and recreated. First checks to see if stack exists,
     * if not creates it. If stack exists check status to see if can be updated, if
     * not, delete and recreate. If no issues go ahead and upadte the stack.
     *
     */
    const status = await getStackStatus(params);

    let events = [];

    const interval = setInterval(async () => {
        const fullList = await getStackEvents({ StackName: params.StackName });

        if (events.length !== fullList.length) {
            console.table(fullList);
            events = fullList;
        }

        const certCreationEvent = fullList.find(event => {
            if (
                event.ResourceType === "AWS::CertificateManager::Certificate" &&
                (event.StatusReason || "").includes("Content of DNS Record")
            ) {
                return true;
            }
        });

        if (certCreationEvent) {
            const dnsRecord = certCreationEvent.StatusReason.split(": ");
            const recordSetName = dnsRecord[2].split(",")[0];
            const recordSetValue = dnsRecord[4].substr(
                0,
                dnsRecord[4].length - 1
            );

            console.log(
                `found request for SSL RecordSet creation at\n${recordSetName}\nfor validation by\n${recordSetValue}\n`
            );

            await createCertRecordSet({
                StackName: params.StackName,
                recordSetName,
                recordSetValue
            });

            console.log(
                "successfully created SSL RecordSet for DNS validation"
            );
        }
    }, 2000);

    switch (status) {
        case undefined:
            // no status means stack doesn't exist
            console.log(`${params.StackName} doest not exist, creating it`);
            await createStack(params);
            break;
        case StackStatus.ROLLBACK_COMPLETE:
        case StackStatus.ROLLBACK_FAILED:
        case StackStatus.UPDATE_ROLLBACK_FAILED:
        case StackStatus.CREATE_FAILED:
            // cases where delete must happen first
            console.log(
                `${params.StackName} is in a failed state. deleting first`
            );
            await deleteStack(params);

            console.log("delete complete. rebuilding stack");
            await createStack(params);
            break;
        default:
            // cases where ready for update
            await updateStack(params);
            break;
    }

    clearInterval(interval);
};
