import { Request, Response, NextFunction } from "express";
import { config } from "@config";

export const nodeWrapper = handler => async (
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
                res.setHeader(name, value as string)
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
        if (!config.PROD) {
            console.error(err);
        }

        res.status(500).json(
            !config.PROD
                ? err
                : { error: { message: "unexpected server error" } }
        );

        next(err);
    }
};
