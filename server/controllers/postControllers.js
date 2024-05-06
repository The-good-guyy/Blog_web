const Post = require("../models/postModel");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handleFactory");
// module.exports.create = async (req, res, next) => {
//   if (!req.body.title || !req.body.content) {
//     return next(new appError(400, "Please provide all required fields"));
//   }
//   const newPost = new Post({
//     ...req.body,
//     userId: req.user.id,
//   });
//   try {
//     const savedPost = await newPost.save();
//     res.status(201).json(savedPost);
//   } catch (error) {
//     next(error);
//   }
// };
module.exports.aliasTop3Post = catchAsync(async (req, res, next) => {
  const result = await Post.aggregate()
    .lookup({
      from: "comments",
      localField: "_id",
      foreignField: "postId",
      as: "comments",
    })
    .addFields({
      commentCount: { $size: "$comments" },
    })
    .project("-content -comments")
    .sort({ commentCount: "desc", numberOfLikes: "desc" })
    .limit(3);
  res.status(200).json({
    status: "success",
    data: {
      data: result,
    },
  });
});
module.exports.create = catchAsync(async (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return next(new appError(400, "Please provide all required fields"));
  }
  const newPost = new Post({
    ...req.body,
    userId: req.user.id,
  });
  const savedPost = await newPost.save();
  res.status(201).json(savedPost);
});
module.exports.getAllPost = factory.getAll(Post);
module.exports.countAllPost = factory.countAll(Post);
module.exports.deletePost = factory.deleteOne(Post);
module.exports.updatePost = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const doc = await Post.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    {
      $set: {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        image: req.body.image,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!doc) {
    return next(new appError(404, "No document found with that ID"));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});
module.exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new appError(404, "Post not found"));
    }
    const userIndex = post.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      post.numberOfLikes += 1;
      post.likes.push(req.user.id);
    } else {
      post.numberOfLikes -= 1;
      post.likes.splice(userIndex, 1);
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};
module.exports.getPost = factory.getOne(Post);
