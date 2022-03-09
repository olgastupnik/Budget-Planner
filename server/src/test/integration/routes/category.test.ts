import supertest from "supertest";
import { expect } from "chai";

import app from "../../../app";
import { postgresDB } from "../../../databases/postgres-db";

describe("Category", () => {
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
  });

  it("Create category", async () => {
    const response = await request
      .post("/api/category")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "Telephone", description: "mmmmmm" });

    expect(response.status).eql(201, "Response status should be 201");
    expect(response.body);
    expect(response.body).keys(["message"]);
    expect(response.body.message).eql("Category has been created");
  });

  it("Create category without token", async () => {
    const response = await request
      .post("/api/category")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer`)
      .send({ title: "Telephone", description: "mmmmmm" });

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("Create default category", async () => {
    const response = await request
      .post("/api/category/admin")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ title: "Telephone", description: "mmmmmm", is_default: "true" });

    expect(response.status).eql(201, "Response status should be 201");
    expect(response.body);
    expect(response.body).keys(["message"]);
    expect(response.body.message).eql("Category has been created");
  });

  it("Create default category without token", async () => {
    const response = await request
      .post("/api/category/admin")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer`)
      .send({ title: "Telephone", description: "mmmmmm", is_default: "true" });

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("Create default category with missing permission", async () => {
    const response = await request
      .post("/api/category/admin")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "Telephone", description: "mmmmmm", is_default: "true" });

    expect(response.status).eql(404, "Response status should be 404");
    expect(response.body).keys(["details", "status"]);
    expect(response.body.status).eql("error");
    expect(response.body.details).eql(`missing permission`);
  });

  it("Get category", async () => {
    const response = await request
      .get("/api/category")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).eql(200, "Response status should be 200");
    expect(response.body);
    expect(response.body).keys(["categories"]);

    categoryId = response.body.categories[0].id as string;
  });

  it("Get category without token", async () => {
    const response = await request
      .get("/api/category")
      .set("Accept", "*/*")
      .set("Authorization", `Bearer`);

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("Delete category without query", async () => {
    const response = await request
      .delete("/api/category/")
      .query({})
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("Delete category without json", async () => {
    const response = await request
      .delete("/api/category/")
      .query({ id: categoryId })
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("Delete category without token", async () => {
    const response = await request
      .delete("/api/category/")
      .query({ id: categoryId })
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("Delete category without json ", async () => {
    const response = await request
      .delete("/api/category/")
      .query({ clear: "true" })
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("Delete category without json", async () => {
    const response = await request
      .delete("/api/category/admin")
      .query({ clear: true })
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("Delete category without query params", async () => {
    const response = await request
      .delete("/api/category/admin")
      .query({})
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("Delete category without query params and token", async () => {
    const response = await request
      .delete("/api/category/admin")
      .query({})
      .set("Accept", "*/*")
      .set("Authorization", `Bearer`);

    expect(response.status).eql(400, "Response status should be 400");
  });

  it("Delete category without permission", async () => {
    const response = await request
      .delete("/api/category/admin")
      .query({})
      .set("Accept", "*/*")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).eql(400, "Response status should be 400");
  });
});
