const Users = require("../models/userModel");
const brcyptjs = require("bcryptjs");
const appError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const factory = require("./handleFactory");
module.exports.updateUser = async (req, res, next) => {
  // if (req.user.id !== req.params.userId) {
  //   return next(new appError(403, "You are not allowed to update this user"));
  // }
  if (req.body.password || req.body.passwordConfirm) {
    return next(new appError(400, "This route is not for password updates."));
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 40) {
      return next(
        new appError(400, "Username must be between 7 and 40 characters")
      );
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        new appError(400, "Username can only contain letters and numbers")
      );
    }
  }
  if (req.body.twitterURL) {
    if (
      !validator.isURL(req.body.twitterURL, {
        protocols: ["http", "https", "ftp"],
        require_tld: true,
        require_protocol: true,
      }) ||
      !validator.contains(req.body.twitterURL, "twitter")
    ) {
      return next(new appError(400, "Must be a Valid Twitter URL"));
    }
  }
  if (req.body.githubURL) {
    if (
      !validator.isURL(req.body.githubURL, {
        protocols: ["http", "https", "ftp"],
        require_tld: true,
        require_protocol: true,
      }) ||
      !validator.contains(req.body.githubURL, "github")
    ) {
      return next(new appError(400, "Must be a Valid Github URL"));
    }
  }
  if (req.body.linkedinURL) {
    if (
      !validator.isURL(req.body.linkedinURL, {
        protocols: ["http", "https", "ftp"],
        require_tld: true,
        require_protocol: true,
      }) ||
      !validator.contains(req.body.linkedinURL, "github")
    ) {
      return next(new appError(400, "Must be a Valid Linkedin URL"));
    }
  }
  if (req.body.bio) {
    if (req.body.bio.length > 180) {
      return next(new appError(400, "Bio must be under 180 characters"));
    }
  }
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          username: req.body.username?.trim(),
          profilePicture: req.body.profilePicture?.trim(),
          twitterURL: req.body.twitterURL?.trim(),
          githubURL: req.body.githubURL?.trim(),
          linkedinURL: req.body.linkedinURL?.trim(),
          // password: req.body.password,
          profilePicture: req.body.profilePicture,
          bio: req.body.bio?.trim(),
        },
      },
      { new: true, runValidators: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    return next(error);
  }
};
module.exports.deleteUser = async (req, res, next) => {
  try {
    await Users.findByIdAndUpdate(req.user.id, { active: false });
    console.log(req.user.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
module.exports.fetchUser = async (req, res, next) => {
  try {
    req.user.password = undefined;
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};
module.exports.getUser = catchAsync(async (req, res, next) => {
  let query = Users.findById(req.params.id);
  const doc = await query;
  doc.password = undefined;
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
module.exports.getAllUsers = catchAsync(async (req, res, next) => {
  // To allow for nested GET reviews on tour (hack)
  const features = new APIFeatures(Users, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // const doc = await features.query.explain();
  const doc = await features.query;
  // SEND RESPONSE
  doc.password = undefined;
  res.status(200).json({
    status: "success",
    results: doc.length,
    data: { data: doc },
  });
});
module.exports.countAllUsers = factory.countAll(Users);
