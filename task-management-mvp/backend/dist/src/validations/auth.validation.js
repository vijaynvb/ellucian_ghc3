"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
exports.authValidation = {
    login: zod_1.z.object({
        body: zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(8)
        }),
        params: zod_1.z.object({}).optional(),
        query: zod_1.z.object({}).optional()
    })
};
