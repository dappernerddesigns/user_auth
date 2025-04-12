const db = require("../db/connection.js");
const app = require("../app");
const seed = require("../db/seed.js");
const request = require("supertest");
const testData = require("../db/data/test_data/users.js");
const endpointsJson = require("../endpoints.json");

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
      username: "Ofella",
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
      email: "obohden0@bbb.org",
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
