const db = require("../db/connection");
const bcrypt = require("bcrypt");

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

  const { rows } = await db.query("SELECT * FROM users WHERE email=$1", [
    email,
  ]);
  if (rows.length === 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const hashedPassword = rows[0].hashed_password;

  const valid = await bcrypt.compare(plainTextPassword, hashedPassword);
  if (!valid) {
    return Promise.reject({ status: 401, msg: "Unauthorised" });
  }
};
