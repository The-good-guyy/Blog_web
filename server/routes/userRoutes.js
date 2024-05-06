const express = require("express");
const router = express.Router();
const {
  updateUser,
  deleteUser,
  fetchUser,
  getUser,
  getAllUsers,
  countAllUsers,
} = require("../controllers/userControllers");
const { verifyToken } = require("../utils/userVerification");
router.put("/update", verifyToken, updateUser);
router.delete("/deleteUser", verifyToken, deleteUser);
router.get("/fetchUser", verifyToken, fetchUser);
router.get("/getOne/:id", getUser);
router.get("/getAll", getAllUsers);
router.get("/countAll", countAllUsers);
module.exports = router;
