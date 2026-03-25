"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const loginAndGetToken = async () => {
    const response = await (0, supertest_1.default)(app_1.default)
        .post("/api/v1/auth/login")
        .send({ email: "admin@example.com", password: "password" });
    return response.body.accessToken;
};
describe("Task API", () => {
    it("should create and list tasks", async () => {
        const token = await loginAndGetToken();
        const createResponse = await (0, supertest_1.default)(app_1.default)
            .post("/api/v1/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Task created in test", priority: "HIGH" });
        expect(createResponse.status).toBe(201);
        const listResponse = await (0, supertest_1.default)(app_1.default)
            .get("/api/v1/tasks")
            .set("Authorization", `Bearer ${token}`);
        expect(listResponse.status).toBe(200);
        expect(Array.isArray(listResponse.body.data)).toBe(true);
    });
});
