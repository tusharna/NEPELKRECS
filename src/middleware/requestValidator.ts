import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export enum ValidationSource {
    BODY = "body",
    QUERY = "query",
    PARAMS = "params",
    HEADERS = "headers"
};



export const validateRequest = (schema: ZodSchema, source: ValidationSource) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = schema.parse(req[source]);
            Object.assign(req[source], data);
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const message = err.errors.map(e => e.message).join(", ");
                return res.status(400).send({ error: message });
            }
        }
    };
};





