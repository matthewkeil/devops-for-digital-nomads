import { RDS } from "cloudform";

export const DbInstanceParameterGroup = new RDS.DBParameterGroup({
    Description: "",
    Family: "aurora5.6",
    Parameters: {}
});
