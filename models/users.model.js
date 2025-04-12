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
