const { addUser, authenticateUser } = require("../models/users.model");

exports.registerUser = async (req, res, next) => {
  try {
    await addUser(req.body);

    res.status(201).json();
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    await authenticateUser(req.body);
    res.status(200).json();
  } catch (err) {
    next(err);
  }
};
