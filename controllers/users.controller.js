const { addUser } = require("../models/users.model");

exports.registerUser = async (req, res, next) => {
  try {
    await addUser(req.body);
    res.status(201).json();
  } catch (err) {
    next(err);
  }
};
