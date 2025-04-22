const db = require("../db/connection.js");
const app = require("../app");
const seed = require("../db/seed.js");
const request = require("supertest");
const testData = require("../db/data/test_data/users.js");
const endpointsJson = require("../endpoints.json");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
  test("201:Server responds with a status message after creating the resource", async () => {
    const newUser = {
      username: "Jersey",
      email: "jersey@gmail.com",
      password: "password123",
    };
    const {
      body: { msg },
    } = await request(app)
      .post("/api/users/registration")
      .send(newUser)
      .expect(201);
    expect(msg).toBe("Resource added to database");
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
      email: "cmatzel9@google.es",
      plainTextPassword: "password1234",
    };

    await request(app).post("/api/users/login").send(login).expect(200);
  });
  test("200:Server responds with a JWT if resource exists", async () => {
    const login = {
      email: "cmatzel9@google.es",
      plainTextPassword: "password1234",
    };

    const {
      body: { msg, token },
    } = await request(app).post("/api/users/login").send(login).expect(200);

    expect(msg).toBe("Credential match found");
    const { username, id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    expect(username).toBe("Clarinda");
    expect(id).toBe(4);
  });
  test("400:Server responds with a Bad Request if user email is not found in database", async () => {
    const login = {
      email: "verity@email.com",
      plainTextPassword: "123",
    };
    const {
      body: { msg },
    } = await request(app).post("/api/users/login").send(login).expect(400);
    expect(msg).toBe("Bad Request");
  });
  test("400:Server responds with a Bad Request if payload keys are incorrect", async () => {
    const login = {
      email: "verity@email.com",
      password: "123",
    };
    const {
      body: { msg },
    } = await request(app).post("/api/users/login").send(login).expect(400);
    expect(msg).toBe("Bad Request");
  });
  test("401:Server responds with Unauthorised if user password does not match record", async () => {
    const login = {
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
describe("GET /api/users/:id", () => {
  test("200:Server responds with requested resource if user token is verified", async () => {
    const token = jwt.sign(
      { id: 1, username: "Karil" },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    const {
      body: { user },
    } = await request(app)
      .get("/api/users/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    const { username, email } = user;

    expect(username).toBe("Karil");
    expect(email).toBe("kgresch6@prlog.org");
  });
  test("401:Server responds with Unauthorised if token is missing", async () => {
    const {
      body: { msg },
    } = await request(app).get("/api/users/1").expect(401);
    expect(msg).toBe("Unauthorised");
  });
  test("401:Server responds with Unauthorised if token is invalid", async () => {
    const {
      body: { msg },
    } = await request(app)
      .get("/api/users/1")
      .set("Authorization", "bad token")
      .expect(401);
    expect(msg).toBe("Invalid or expired token");
  });
  test("401:Server responds with Unauthorised if token has expired", async () => {
    const expiredToken = jwt.sign(
      { id: 1, username: "Karil" },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1ms" }
    );

    await new Promise((resolve) => setTimeout(resolve, 15));

    const {
      body: { msg },
    } = await request(app)
      .get("/api/users/1")
      .set("Authorization", `Bearer ${expiredToken}`)
      .expect(401);
    expect(msg).toBe("Invalid or expired token");
  });
  test("401:Server responds with Unauthorised if a token is valid, but the request is for a different user profile", async () => {
    const token = jwt.sign(
      { id: 1, username: "Karil" },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    const {
      body: { msg },
    } = await request(app)
      .get("/api/users/2")
      .set("Authorization", `Bearer ${token}`)
      .expect(401);
    expect(msg).toBe("Unauthorised");
  });
});
describe("DELETE /api/users/:id", () => {
  test("204:Server deletes the requested resource if user token is verified", async () => {
    const token = jwt.sign(
      { id: 1, username: "Karil" },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    await request(app)
      .delete("/api/users/1")
      .set("authorization", `Bearer ${token}`)
      .expect(204);
  });
  test("401:Server responds with Unauthorised if token is missing", async () => {
    const {
      body: { msg },
    } = await request(app).delete("/api/users/1").expect(401);
    expect(msg).toBe("Unauthorised");
  });
  test("401:Server responds with Unauthorised if token is invalid", async () => {
    const {
      body: { msg },
    } = await request(app)
      .delete("/api/users/1")
      .set("Authorization", "bad token")
      .expect(401);
    expect(msg).toBe("Invalid or expired token");
  });
  test("401:Server responds with Unauthorised if token has expired", async () => {
    const expiredToken = jwt.sign(
      { id: 1, username: "Karil" },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1ms" }
    );

    await new Promise((resolve) => setTimeout(resolve, 15));

    const {
      body: { msg },
    } = await request(app)
      .delete("/api/users/1")
      .set("Authorization", `Bearer ${expiredToken}`)
      .expect(401);
    expect(msg).toBe("Invalid or expired token");
  });
  test("401:Server responds with Unauthorised if a token is valid, but the request is for a different user profile", async () => {
    const token = jwt.sign(
      { id: 1, username: "Karil" },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    const {
      body: { msg },
    } = await request(app)
      .delete("/api/users/2")
      .set("Authorization", `Bearer ${token}`)
      .expect(401);
    expect(msg).toBe("Unauthorised");
  });
});
