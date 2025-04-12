exports.handlePSQLErrorCodes = (err, req, res, next) => {
  const badRequestErrors = ["23505", "22P02"];
  if (badRequestErrors.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};
