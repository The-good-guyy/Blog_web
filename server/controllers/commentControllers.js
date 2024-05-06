const Comment = require("../models/commentModel");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handleFactory");
const Post = require("../models/postModel");
const APIFeatures = require("../utils/apiFeatures");
module.exports.createComment = catchAsync(async (req, res, next) => {
  if (!req.body.content) {
    return next(new appError(400, "Please provide the content"));
  }
  if (!req.params.id) {
    return next(new appError(400, "Please provide the postId"));
  }
  const newComment = new Comment({
    ...req.body,
    userId: req.user.id,
    postId: req.params.id,
  });
  const savedComment = await newComment.save();
  res.status(201).json(savedComment);
});
module.exports.getAllComments = factory.getAll(Comment);
module.exports.likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(new appError(404, "Comment not found"));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};
module.exports.getOneComment = factory.getOne(Comment);
module.exports.editComment = catchAsync(async (req, res, next) => {
  const doc = await Comment.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    {
      content: req.body.content,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!doc) {
    return next(new appError(404, "No comment found with that ID"));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});
module.exports.countAllComment = factory.countAll(Comment);
module.exports.deleteComment = factory.deleteOne(Comment);
module.exports.getMonthlyComment = catchAsync(async (req, res, next) => {
  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate()
  );
  console.log(oneMonthAgo);
  const result = await Comment.aggregate([
    {
      $match: { createdAt: { $gte: oneMonthAgo } },
    },
    { $sort: { createdAt: 1 } },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      result,
    },
  });
});
module.exports.getCommentOnUserPost = catchAsync(async (req, res, next) => {
  const results = await Post.find({ userId: req.params.id }).select("_id");
  const data = [];
  results.map((result) => data.push(result._id));
  const features = new APIFeatures(Comment.find({ postId: data }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;
  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});
module.exports.CountCommentOnUserPost = catchAsync(async (req, res, next) => {
  const results = await Post.find({ userId: req.params.id }).select("_id");
  const data = [];
  results.map((result) => data.push(result._id));
  const commentResult = await Comment.find({ postId: data });
  res.status(200).json({
    status: "success",
    data: {
      data: commentResult.length,
    },
  });
});
