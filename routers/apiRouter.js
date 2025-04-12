const apiRouter = require("express").Router();
const usersRouter = require("./usersRouter");
const endpoints = require("../endpoints.json");
apiRouter.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
