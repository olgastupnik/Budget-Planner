import supertest from "supertest";
import { expect } from "chai";
import { testUser, testAdmin } from "../../mock/user.json";

import app from "../../../app";
import { postgresDB } from "../../../databases/postgres-db";

describe("Communal", () => {
  let request: supertest.SuperTest<supertest.Test>;
  let userToken = "";
  let userId = "";
  let communalId = "";
  let adminToken = "";

  before(async () => {
    await postgresDB();
    request = supertest(app.callback());
  });
  it("Create user&&admin and login", async () => {
    await request
      .post("/api/user/register")
      .set("Accept", "*/*")
      .send(testUser);

    await request
      .post("/api/user/register")
      .set("Accept", "*/*")
      .send(testAdmin);

    const user = await request
      .post("/api/user/login")
      .set("Accept", "*/*")
      .send({ email: "user@gmail.com", password: "que123" });

    expect(user.body).keys(["token", "user"]);
    userToken = user.body.token as string;
    userId = user.body.user.id as string;

    const admin = await request
      .post("/api/user/login")
      .set("Accept", "*/*")
      .send({ email: "admin@gmail.com", password: "que123" });

    expect(user.body).keys(["token", "user"]);
    adminToken = admin.body.token as string;
  });

  it("Create communal", async () => {
    const response = await request
      .post("/api/communal")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ total: "12", bills: { gas: 123 } });

    expect(response.status).eql(201, "Response status should be 201");
    expect(response.body);
    expect(response.body).keys(["message"]);
    expect(response.body.message).eql("Communal has been created");
  });

  it("Create communal without token", async () => {
    const response = await request
      .post("/api/communal")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer`)
      .send({ total: "12", bills: { gas: 123 } });

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("Create communal without token and total", async () => {
    const response = await request
      .post("/api/communal")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer`)
      .send({ bills: { gas: 123 } });

    expect(response.status).eql(400, "Response status should be 400");
    expect(response.body).keys(["details", "status"]);
    expect(response.body.status).eql("error");
    expect(response.body.details).eql(`"total" is required`);
  });

  it("Get communal", async () => {
    const response = await request
      .get("/api/communal")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).eql(200, "Response status should be 200");
    expect(response.body);
    expect(response.body).keys(["communal"]);
    communalId = response.body.communal[0].id;
  });

  it("Get communal without token", async () => {
    const response = await request
      .get("/api/communal")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer`);

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("Patch communal without token", async () => {
    const response = await request
      .patch("/api/communal")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer`);

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("Patch communal", async () => {
    const response = await request
      .patch("/api/communal")
      .send({ total: "12", id: communalId })
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).eql(200, "Response status should be 200");
    expect(response.body);
    expect(response.body).keys(["message"]);
    expect(response.body.message).eql("Communal was updated successfully.");
  });

  it("Patch communal with incorrect id of communal", async () => {
    const response = await request
      .patch("/api/communal")
      .send({ total: "12", id: "148231cc-8fe1-4fce-b8fc-4667087eeaab" })
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).eql(404, "Response status should be 404");
    expect(response.body).keys(["details", "status"]);
    expect(response.body.status).eql("error");
    expect(response.body.details).eql(`Has not found communal by id`);
  });

  it("Delete communal by incorrect permission ", async () => {
    const response = await request
      .delete("/api/communal/148231cc-8fe1-4fce-b8fc-4667087eeaab")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).eql(404, "Response status should be 404");
    expect(response.body).keys(["details", "status"]);
    expect(response.body.status).eql("error");
    expect(response.body.details).eql(`missing permission`);
  });

  it("Delete communal by incorrect user`s id ", async () => {
    const response = await request
      .delete("/api/communal/148231cc-8fe1-4fce-b8fc-4667087eeaab")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).eql(400, "Response status should be 400");
    expect(response.body).keys(["details", "status"]);
    expect(response.body.status).eql("error");
    expect(response.body.details).eql("Has not found communal by user`s id");
  });

  it("Delete communal by user`s id ", async () => {
    const response = await request
      .delete(`/api/communal/${userId}`)
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).eql(200, "Response status should be 200");
    expect(response.body);
    expect(response.body).keys(["message"]);
    expect(response.body.message).eql("Communal were deleted successfully!");
  });
});
