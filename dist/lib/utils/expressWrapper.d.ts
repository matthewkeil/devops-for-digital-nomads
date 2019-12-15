import { Request, Response, NextFunction } from "express";
export declare const nodeWrapper: (handler: any) => (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response, next: NextFunction) => Promise<void>;
