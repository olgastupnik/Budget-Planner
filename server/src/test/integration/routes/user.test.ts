import supertest from "supertest";
import { expect } from "chai";
import { testUser, testAdmin, patchUser } from "../../mock/user.json";

import app from "../../../app";
import { postgresDB } from "../../../databases/postgres-db";

describe("User", () => {
  let request: supertest.SuperTest<supertest.Test>;
  let userToken = "";
  let userId = "";
  let adminToken = "";
  let adminId = "";
  before(async () => {
    await postgresDB();
    request = supertest(app.callback());
  });

  it("Register user with user role", async () => {
    const response = await request
      .post("/api/user/register")
      .set("Accept", "*/*")
      .send(testUser);

    expect(response.status).eql(201, "Response status should be 201");
    expect(response.body);
    expect(response.body).keys(["message"]);
    expect(response.body.message).eql("User has been created");
  });

  it("Register user with admin role", async () => {
    const response = await request
      .post("/api/user/register")
      .set("Accept", "*/*")
      .send(testAdmin);

    expect(response.status).eql(201, "Response status should be 201");
    expect(response.body);
    expect(response.body).keys(["message"]);
    expect(response.body.message).eql("User has been created");
  });

  it("Register user with existing email in db", async () => {
    const response = await request
      .post("/api/user/register")
      .set("Accept", "*/*")
      .send(testUser);

    expect(response.status).eql(400, "Response status should be 400");
    expect(response.body);
    expect(response.body).keys(["status", "details"]);
    expect(response.body.status).eql("error");
    expect(response.body.details).eql("User has already existed");
  });

  it('Login with not existing user"', async () => {
    const response = await request
      .post("/api/user/login")
      .set("Accept", "*/*")
      .send({ email: "use@test.com", password: "que123" });

    expect(response.status).eql(404, "Response status should be 400");
    expect(response.body).keys(["status", "details"]);
    expect(response.body.status).eql("error");
    expect(response.body.details).eql("Cannot find User");
  });

  it("Login user", async () => {
    const response = await request
      .post("/api/user/login")
      .set("Accept", "*/*")
      .send({ email: "user@gmail.com", password: "que123" });

    expect(response.status).eql(200, "Response status should be 200");
    expect(response.body).keys(["token", "user"]);
    userToken = response.body.token as string;
    userId = response.body.user.id as string;
  });

  it("Login admin", async () => {
    const response = await request
      .post("/api/user/login")
      .set("Accept", "*/*")
      .send({ email: "admin@gmail.com", password: "que123" });

    expect(response.status).eql(200, "Response status should be 200");
    expect(response.body).keys(["token", "user"]);
    adminToken = response.body.token as string;
    adminId = response.body.user.id as string;
  });

  it("Login with incorrect password", async () => {
    const response = await request
      .post("/api/user/login")
      .set("Accept", "*/*")
      .send({ email: "user@test.com", password: "que135" });

    expect(response.status).eql(404, "Response status should be 404");
    expect(response.body).keys(["status", "details"]);
    expect(response.body.status).eql("error");
    expect(response.body.details).eql("Cannot find User");
  });

  it("Login with invalid password", async () => {
    const response = await request
      .post("/api/user/login")
      .set("Accept", "*/*")
      .send({ email: "user@test.com", password: "que13" });

    expect(response.status).eql(400, "Response status should be 400");
    expect(response.body).keys(["status", "details"]);
    expect(response.body.status).eql("error");
    expect(response.body.details).eql(
      '"password" length must be at least 6 characters long'
    );
  });

  it("GET  user", async () => {
    const response = await request
      .get("/api/user/")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).eql(200, "Response status should be 200");
    expect(response.body).keys([
      "id",
      "firstName",
      "lastName",
      "email",
      "avatar",
      "budgetAmount",
    ]);
  });

  it("GET user without token", async () => {
    const response = await request
      .get("/api/user/")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer`);

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("Edit user", async () => {
    const response = await request
      .patch("/api/user/")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${userToken}`)
      .send(patchUser);

    expect(response.status).eql(200, "Response status should be 200");
    expect(response.body).keys(["message"]);
    expect(response.body.message).eql("User was updated successfully");
  });

  it("PATCH user without token ", async () => {
    const response = await request
      .patch("/api/user/")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer `)
      .send(patchUser);

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("PATCH  user by id for admin", async () => {
    const response = await request
      .patch(`/api/user/${adminId}`)
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(patchUser);

    expect(response.status).eql(200, "Response status should be 200");
    expect(response.body).keys(["message"]);
    expect(response.body.message).eql("User was updated successfully");
  });

  it("DELETE  user by id", async () => {
    const response = await request
      .delete(`/api/user/${userId}`)
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).eql(404, "Response status should be 401");
    expect(response.body).keys(["details", "status"]);
    expect(response.body.status).eql("error");
    expect(response.body.details).eql("User by id wasn't found");
  });

  it("DELETE user by id repeatedly", async () => {
    const response = await request
      .delete(`/api/user/${userId}`)
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).eql(404, "Response status should be 404");
    expect(response.body).keys(["status", "details"]);
    expect(response.body.status).eql("error");
    expect(response.body.details).eql("User by id wasn't found");
  });
});
