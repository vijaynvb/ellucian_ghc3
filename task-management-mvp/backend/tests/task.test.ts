import request from "supertest";
import app from "../src/app";

const loginAndGetToken = async () => {
  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "admin@example.com", password: "password" });

  return response.body.accessToken as string;
};

describe("Task API", () => {
  it("should create and list tasks", async () => {
    const token = await loginAndGetToken();

    const createResponse = await request(app)
      .post("/api/v1/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Task created in test", priority: "HIGH" });

    expect(createResponse.status).toBe(201);

    const listResponse = await request(app)
      .get("/api/v1/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body.data)).toBe(true);
  });
});
