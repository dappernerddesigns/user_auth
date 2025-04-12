const seed = require("./seed.js");
const db = require("./connection.js");
const data = require("./data/dev_data/users.js");

seed(data).then(() => {
  return db.end();
});
