const usersRouter = require("express").Router();
const { registerUser, loginUser } = require("../controllers/users.controller");

usersRouter.post("/registration", registerUser);
usersRouter.post("/login", loginUser);
module.exports = usersRouter;
