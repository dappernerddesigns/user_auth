const db = require("../db/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.addUser = async (payload) => {
  const { username, email, password } = payload;
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await db.query(
    "INSERT INTO users(username,email,hashed_password) VALUES ($1,$2,$3)",
    [username, email, hash]
  );

  return rows[0];
};

exports.authenticateUser = async (payload) => {
  const { email, plainTextPassword } = payload;
  if (!plainTextPassword || !email) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const { rows } = await db.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);
  if (rows.length === 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const { hashed_password, user_id, username } = rows[0];

  const valid = await bcrypt.compare(plainTextPassword, hashed_password);
  if (!valid) {
    return Promise.reject({ status: 401, msg: "Unauthorised" });
  }

  const token = jwt.sign(
    { id: user_id, username },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "2h",
    }
  );
  return token;
};

exports.fetchUser = async (id, authorisation) => {
  if (!authorisation) {
    return Promise.reject({ status: 401, msg: "Unauthorised" });
  }
  const [_, token] = authorisation.split(" ");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { rows } = await db.query(
      "SELECT user_id, username,email FROM users WHERE user_id=$1",
      [id]
    );
    const { user_id, username } = rows[0];
    if (user_id === decoded.id && username === decoded.username) {
      return rows[0];
    } else {
      return Promise.reject({ status: 401, msg: "Unauthorised" });
    }
  } catch (err) {
    return Promise.reject({ status: 401, msg: "Invalid or expired token" });
  }
};

exports.removeUser = async (id, authorization) => {
  if (!authorization) {
    return Promise.reject({ status: 401, msg: "Unauthorised" });
  }

  const [_, token] = authorization.split(" ");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { rows } = await db.query(
      "DELETE FROM users WHERE user_id=$1 RETURNING *",
      [id]
    );

    const { user_id, username } = rows[0];
    if (user_id === decoded.id && username === decoded.username) {
      return;
    } else {
      return Promise.reject({ status: 401, msg: "Unauthorised" });
    }
  } catch (err) {
    return Promise.reject({
      status: 401,
      msg: "Invalid or expired token",
    });
  }
};
