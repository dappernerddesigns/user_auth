const express = require("express");
const app = express();
const apiRouter = require("./routers/apiRouter");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(apiRouter);

module.exports = app;
