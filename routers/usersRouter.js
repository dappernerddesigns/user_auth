const usersRouter = require("express").Router();
const {
  registerUser,
  loginUser,
  getUser,
} = require("../controllers/users.controller");

usersRouter.post("/registration", registerUser);
usersRouter.post("/login", loginUser);
usersRouter.get("/:email", getUser);
module.exports = usersRouter;
