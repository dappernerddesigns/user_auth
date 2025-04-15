const {
  addUser,
  authenticateUser,
  fetchUser,
  removeUser,
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
    const token = await authenticateUser(req.body);
    res.status(200).json({ msg: "Credential match found", token });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const { email } = req.params;
    const { authorization } = req.headers;
    const user = await fetchUser(email, authorization);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { authorization } = req.headers;

    await removeUser(id, authorization);
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
