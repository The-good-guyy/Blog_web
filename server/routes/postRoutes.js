const express = require("express");
const { verifyToken } = require("../utils/userVerification");
const {
  create,
  getAllPost,
  countAllPost,
  deletePost,
  updatePost,
  getPost,
  likePost,
  aliasTop3Post,
} = require("../controllers/postControllers");
const { restrictTo } = require("../controllers/authControllers");
const router = express.Router();
router.post("/create", verifyToken, restrictTo("admin"), create);
router.get("/getAll", getAllPost);
router.get("/countAll", countAllPost);
router.delete("/delete/:id", verifyToken, restrictTo("admin"), deletePost);
router.put("/update/:id", verifyToken, restrictTo("admin"), updatePost);
router.get("/getOne/:id", getPost);
router.put("/like/:id", verifyToken, likePost);
router.get("/top-3-popular", aliasTop3Post);
module.exports = router;
