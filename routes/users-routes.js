const express = require("express");
const HttpError = require("../models/http-error");
const { check } = require("express-validator");

const fileUpload = require("../middleware/file-upload");
const usersController = require("../controller/users-controller");

const router = express.Router();

router.get("/", usersController.getUsers);
router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 4 }),
  ],
  usersController.signup
);
router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 4 }),
  ],
  usersController.login
);

module.exports = router;
