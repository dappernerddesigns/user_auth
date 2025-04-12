const db = require("../db/connection.js");
const app = require("../app");
const seed = require("../db/seed.js");
const request = require("supertest");
const testData = require("../db/data/test_data/users.js");
const endpointsJson = require("../endpoints.json");
const bcrypt = require("bcrypt");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", async () => {
    const {
      body: { endpoints },
    } = await request(app).get("/api").expect(200);
    expect(endpoints).toEqual(endpointsJson);
  });
});

describe("POST /api/users/registration", () => {
  test("201:Server responds with a status of 201 after creating the resource", async () => {
    const newUser = {
      username: "Jersey",
      email: "jersey@gmail.com",
      password: "password123",
    };
    await request(app)
      .post("/api/users/registration")
      .send(newUser)
      .expect(201);
  });
  test("400:Server responds with bad request if the username already exists", async () => {
    const newUser = {
      username: "Karil",
      email: "ofella@gmail.com",
      password: "banana",
    };
    const {
      body: { msg },
    } = await request(app)
      .post("/api/users/registration")
      .send(newUser)
      .expect(400);
    expect(msg).toBe("Bad Request");
  });
  test("400:Server responds with bad request if the email already exists", async () => {
    const newUser = {
      username: "Jersey",
      email: "kgresch6@prlog.org",
      password: "banana",
    };
    const {
      body: { msg },
    } = await request(app)
      .post("/api/users/registration")
      .send(newUser)
      .expect(400);
    expect(msg).toBe("Bad Request");
  });
});
describe("POST /api/users/login", () => {
  test("200:Server responds with a status of 200 if user credentials match", async () => {
    const login = {
      username: "Clarinda",
      email: "cmatzel9@google.es",
      plainTextPassword: "password1234",
    };

    await request(app).post("/api/users/login").send(login).expect(200);
  });
  test("400:Server responds with a bad request if user email is not found in database", async () => {
    const login = {
      username: "Verity",
      email: "verity@email.com",
      plainTextPassword: "123",
    };
    const {
      body: { msg },
    } = await request(app).post("/api/users/login").send(login).expect(400);
    expect(msg).toBe("Bad Request");
  });
  test("401:Server responds with Unauthorised if user password does not match record", async () => {
    const login = {
      username: "Chloe",
      email: "cgovier8@un.org",
      plainTextPassword: "password123",
    };
    login.plainTextPassword = await bcrypt.hash("123456", 10);
    const {
      body: { msg },
    } = await request(app).post("/api/users/login").send(login).expect(401);
    expect(msg).toBe("Unauthorised");
  });
});
