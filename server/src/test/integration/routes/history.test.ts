import supertest from "supertest";
import { expect } from "chai";

import app from "../../../app";
import { postgresDB } from "../../../databases/postgres-db";

describe("History", () => {
  let request: supertest.SuperTest<supertest.Test>;
  let userToken = "";
  let userId = "";
  let adminToken = "";
  let categoryId = "";
  before(async () => {
    await postgresDB();
    request = supertest(app.callback());
  });
  it("Create user&&admin and login", async () => {
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

    const category = await request
      .get("/api/category")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(category.body).keys(["categories"]);

    categoryId = category.body.categories[0].id as string;
  });
  it("Create history", async () => {
    const response = await request
      .post("/api/history")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ type: "income", amount: "3", category: categoryId });

    expect(response.status).eql(201, "Response status should be 201");
    expect(response.body);
    expect(response.body).keys(["message"]);
    expect(response.body.message).eql("create new history");
  });

  it("Create history without token", async () => {
    const response = await request
      .post("/api/history")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer`)
      .send({ type: "income", amount: "3", category: categoryId });

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("Create history without amount field", async () => {
    const response = await request
      .post("/api/history")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ type: "income", category: categoryId });

    expect(response.status).eql(400, "Response status should be 400");
    expect(response.body).keys(["details", "status"]);
    expect(response.body.status).eql("error");
    expect(response.body.details).eql(`"amount" is required`);
  });

  it("Create history without type field", async () => {
    const response = await request
      .post("/api/history")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ amount: "3", category: categoryId });

    expect(response.status).eql(400, "Response status should be 400");
    expect(response.body).keys(["details", "status"]);
    expect(response.body.status).eql("error");
    expect(response.body.details).eql(`"type" is required`);
  });

  it("Create history without categoryId field", async () => {
    const response = await request
      .post("/api/history")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ type: "income", amount: "3" });

    expect(response.status).eql(400, "Response status should be 400");
    expect(response.body).keys(["details", "status"]);
    expect(response.body.status).eql("error");
    expect(response.body.details).eql(`"category" is required`);
  });

  it("Get history without token", async () => {
    const response = await request
      .get("/api/history")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer`);

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("Get history ", async () => {
    const response = await request
      .get("/api/history")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).eql(200, "Response status should be 200");
    expect(response.body);
    expect(response.body).keys(["histories", "historiesLength"]);
  });

  it("Admin delete history by user id without token ", async () => {
    const response = await request
      .delete(`/api/history/${userId}`)
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).eql(400, "Response status should be 400");
  });

  it(" Delete history by user id without valid query ", async () => {
    const response = await request
      .delete(`/api/history/${userId}`)
      .query({ deleteAll: "true" })
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).eql(400, "Response status should be 400");
    expect(response.body).keys(["details", "status"]);
    expect(response.body.status).eql("error");
    expect(response.body.details).eql(`expected json`);
  });
});
