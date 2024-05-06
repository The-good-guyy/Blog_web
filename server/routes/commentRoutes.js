const express = require("express");
const { verifyToken } = require("../utils/userVerification");
const {
  createComment,
  getAllComments,
  likeComment,
  getOneComment,
  editComment,
  countAllComment,
  deleteComment,
  getCommentOnUserPost,
  CountCommentOnUserPost,
} = require("../controllers/commentControllers");
const { restrictTo } = require("../controllers/authControllers");
const router = express.Router();
router.post("/create/:id", verifyToken, createComment);
router.get("/getAll", getAllComments);
router.get("/countAll", countAllComment);
router.put("/update/:id", verifyToken, editComment);
router.get("/getOne/:id", getOneComment);
router.put("/like/:id", verifyToken, likeComment);
router.delete("/delete/:id", verifyToken, deleteComment);
router.get("/getUserPost/:id", getCommentOnUserPost);
router.get("/countUserPost/:id", CountCommentOnUserPost);
module.exports = router;
