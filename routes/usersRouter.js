const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  profile,
} = require("../controllers/authController");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.get("/", (req, res) => {
  res.send("Welcome");
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logout);

router.get("/profile", isLoggedIn, profile);

module.exports = router;
