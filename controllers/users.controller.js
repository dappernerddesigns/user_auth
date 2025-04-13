const {
  addUser,
  authenticateUser,
  fetchUser,
} = require("../models/users.model");

exports.registerUser = async (req, res, next) => {
  try {
    await addUser(req.body);

    res.status(201).json({ msg: "Resource added to database" });
  } catch (err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    await authenticateUser(req.body);
    res.status(200).json({ msg: "Credential match found" });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await fetchUser(email);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
