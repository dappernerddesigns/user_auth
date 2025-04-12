const usersRouter = require("express").Router();
const { registerUser } = require("../controllers/users.controller");

usersRouter.post("/registration", registerUser);
module.exports = usersRouter;
