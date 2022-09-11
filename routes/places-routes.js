const express = require("express");
const HttpError = require("../models/http-error");
const placeController = require("../controller/places-controller");
const { check } = require("express-validator");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const fileUpload = require("../middleware/file-upload");
router.get("/:pid", placeController.getPlaceById);
router.get("/user/:uid", placeController.getPlacesByUserId);

router.use(checkAuth);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").notEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").notEmpty(),
  ],
  placeController.createPlace
);
router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placeController.updatePlace
);
router.delete("/:pid", placeController.deletePlace);

module.exports = router;
