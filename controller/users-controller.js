const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v1: uuidv1 } = require("uuid");

const HttpError = require("../models/http-error");
const User = require("../models/user");
const { fileUpload } = require("../middleware/file-upload");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Fetching users faild, please try again", 500);
    return next(error);
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("Invalid Input", 422));
  }
  const { name, email, password } = req.body;

  // const file = req.file;
  // const fileName = `${uuidv1()}.png`;
  // console.log(fileName);
  // const imageRef = ref(storage, fileName);
  // const metatype = { contentType: file.mimetype, name: file.originalname };
  // await uploadBytes(imageRef, file.buffer, metatype).catch((error) =>
  //   console.log(error.message)
  // );

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing Up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
    req.file.path = await fileUpload(req, res);
    // console.log();
  } catch (err) {
    const error = new HttpError("Could not create user,Please try again", 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });
  // console.log(req);
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed,Please try again", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed,Please try again", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    throw new HttpError("Invalid Input", 422);
  }
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Loging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Entered Wrong Details", 403);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, Please check your credentials and try again",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Entered Wrong Details", 403);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Logging in failed,Please try again", 500);
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
  });
};

// const identifiedUser = Dummy_User.find((u) => u.email === email);
// if (!identifiedUser) {
//   throw new HttpError("Could not identify User", 401);
// }
// if (identifiedUser.password !== password) {
//   throw new HttpError("Entered Wrong Details", 401);
// }

//   res.json({
//     message: "Logged In",
//     user: existingUser.toObject({ getter: true }),
//   });
// };

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
