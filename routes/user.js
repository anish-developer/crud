const express = require("express");
const { allUser, registerUser, userProfile } = require("../controller/user");
const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + file.originalname);
  },
});

// filter
const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.split("/")[1] === "jpg" ||
    file.mimetype.split("/")[1] === "png" ||
    file.mimetype.split("/")[1] === "jpeg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Not a jpg or png File!!"), false);
  }
};

// const upload = multer({ storage: storage, fileFilter: multerFilter });
const upload = multer({ storage: storage, fileFilter: multerFilter });

router.get("/", allUser);
router.post("/register", upload.single("profile"), registerUser);
router.post("/profile", userProfile);
module.exports = router;
