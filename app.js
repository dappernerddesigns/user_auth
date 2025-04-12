const express = require("express");
const app = express();
const apiRouter = require("./routers/apiRouter");
const cors = require("cors");
const {
  handlePSQLErrorCodes,
  handleServerErrors,
  handleCustomErrors,
} = require("./errors/errorHandlers");

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.use(handleCustomErrors);
app.use(handlePSQLErrorCodes);
app.use(handleServerErrors);
module.exports = app;
