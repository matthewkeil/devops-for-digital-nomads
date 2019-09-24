import { Response } from "./Response";
import { Request } from "./Request";

export type Handler = (req: Request) => Promise<Response>;
