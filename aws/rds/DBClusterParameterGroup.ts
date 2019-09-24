import { RDS } from "cloudform";

export const DbClusterParameterGroup = new RDS.DBClusterParameterGroup({
    Description: "",
    Family: "aurora5.6",
    Parameters: {}
});
