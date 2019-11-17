import { Request, Response, NextFunction } from "express";
import { Handler } from "../interfaces";
import { ENV } from "./ENV";

export const nodeWrapper = (handler: Handler) => async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const response = await handler({
            body: req.body,
            parameters: req.params,
            headers: req.headers
        });

        if (response.headers) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            Object.entries(response.headers).forEach(([name, value]) =>
                res.setHeader(name, value)
            );
        }

        if (response.statusCode) {
            res.status(response.statusCode);
        } else {
            res.status(200);
        }

        if (response.body) {
            res.json(response.body);
        } else {
            res.send();
        }
    } catch (err) {
        if (ENV.DEV) {
            console.error(err);
        }

        res.status(500).json(
            ENV.DEV ? err : { error: { message: "unexpected server error" } }
        );

        next(err);
    }
};
