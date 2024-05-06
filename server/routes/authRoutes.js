const express = require("express");
const router = express.Router();
const {
  signUp,
  googleSignIn,
  logIn,
  forgotPassword,
  resetPassword,
  updatePassword,
  logout,
} = require("../controllers/authControllers");
const { verifyToken } = require("../utils/userVerification");
router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/googleauth", googleSignIn);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updatePassword", verifyToken, updatePassword);
router.get("/logout", logout);
module.exports = router;
