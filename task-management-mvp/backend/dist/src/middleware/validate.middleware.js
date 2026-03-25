"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const appError_1 = require("../utils/appError");
const validate = (schema) => {
    return (req, _res, next) => {
        try {
            schema.parse({
                body: req.body,
                params: req.params,
                query: req.query
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                next(new appError_1.AppError("BAD_REQUEST", 400, error.issues.map((item) => item.message).join("; ")));
                return;
            }
            next(error);
        }
    };
};
exports.validate = validate;
