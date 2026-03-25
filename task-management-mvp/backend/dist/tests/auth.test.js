"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe("Auth API", () => {
    it("should return token for valid credentials", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/auth/login")
            .send({ email: "admin@example.com", password: "password" });
        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.user.role).toBe("ADMIN");
    });
    it("should reject invalid payload", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/auth/login")
            .send({ email: "bad-email" });
        expect(response.status).toBe(400);
    });
});
