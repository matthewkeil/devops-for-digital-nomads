import { v4 } from "uuid";
import { lambdaWrapper } from "../utils";
import { Route } from "../interfaces";

const handler = () => {
    // https://stackoverflow.com/questions/20342058/which-uuid-version-to-use
    return Promise.resolve({
        body: v4()
    });
};

export const lambda = lambdaWrapper(handler);

export const randomNumber: Route = {
    handler,
    method: "GET",
    path: "/randomNumber",
    auth: false
};
