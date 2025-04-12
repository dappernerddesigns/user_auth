const format = require("pg-format");
const db = require("./connection.js");
const bcrypt = require("bcrypt");

const seed = async (users) => {
  await db.query(`DROP TABLE IF EXISTS users`);
  await db.query(`CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE,
    email VARCHAR(255) UNIQUE,
    hashed_password TEXT)`);

  const formattedUsers = users.map(({ username, email, password }) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return [username, email, hash];
  });
  const queryStr = format(
    `INSERT INTO USERS(username, email, hashed_password) VALUES %L`,
    formattedUsers
  );
  await db.query(queryStr);
};

module.exports = seed;
