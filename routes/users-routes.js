const express = require("express");

const HttpError = require("../models/http-error");
const { check } = require("express-validator");

const usersController = require("../controller/users-controller");
const { upload } = require("../middleware/file-upload");

const router = express.Router();

router.get("/", usersController.getUsers);
router.post(
  "/signup",
  upload.single("image"),
  [
    check("name").notEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);
router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.login
);

module.exports = router;
