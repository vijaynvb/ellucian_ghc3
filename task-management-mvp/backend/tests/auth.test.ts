import request from "supertest";
import app from "../src/app";

describe("Auth API", () => {
  it("should return token for valid credentials", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "admin@example.com", password: "password" });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
    expect(response.body.user.role).toBe("ADMIN");
  });

  it("should reject invalid payload", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "bad-email" });

    expect(response.status).toBe(400);
  });
});
