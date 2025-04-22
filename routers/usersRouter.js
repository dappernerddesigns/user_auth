const usersRouter = require("express").Router();
const {
  registerUser,
  loginUser,
  getUser,
  deleteUser,
} = require("../controllers/users.controller");

usersRouter.post("/registration", registerUser);
usersRouter.post("/login", loginUser);
usersRouter.get("/:id", getUser);
usersRouter.delete("/:id", deleteUser);
module.exports = usersRouter;
