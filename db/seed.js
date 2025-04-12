const format = require("pg-format");
const db = require("./connection.js");

const seed = async (users) => {
  await db.query(`DROP TABLE IF EXISTS users`);
  await db.query(`CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(30),
    email VARCHAR(255),
    hashed_password TEXT)`);

  const formattedUsers = users.map(({ username, email, password }) => [
    username,
    email,
    password,
  ]);
  const queryStr = format(
    `INSERT INTO USERS(username, email, hashed_password) VALUES %L`,
    formattedUsers
  );
  await db.query(queryStr);
};

module.exports = seed;
