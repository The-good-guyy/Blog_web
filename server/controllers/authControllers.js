const Users = require("../models/userModel");
const brcyptjs = require("bcryptjs");
const appError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const crypto = require("crypto");
const Email = require("../utils/email");
const { dirname } = require("path");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRETKEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  res.cookie("access_token", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
  res.cookie("second_token", "loggedin", {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
  user.password = undefined;

  res.status(statusCode).json(user);
};
module.exports.signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      next(new appError(500, "All fields is required"));
    }
    if (password.length < 8) {
      next(new appError(500, "Password must be al least 8 characters long"));
    }
    if (password.length > 30) {
      next(new appError(500, "Password must be under 30 characters long"));
    }
    // const user = new Users({
    //   username,
    //   email,
    //   password: hashedPassword,
    //   twitterURL: "",
    // });
    // user.$ignore("twitterURL", "githubURL", "linkedinURL");
    // await user.validate({
    //   validateModifiedOnly: false,
    //   pathsToSkip: ["twitterURL", "githubURL", "linkedinURL"],
    // });
    const hashedPassword = brcyptjs.hashSync(password, 12);
    const newUser = await Users.create({
      username,
      email,
      password: hashedPassword,
    });
    const { password: pass, ...rest } = newUser._doc;
    return res.json(rest);
  } catch (error) {
    next(error);
  }
};
module.exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.access_token) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.access_token,
        process.env.JWT_SECRET
      );

      const currentUser = await Users.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
module.exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      next(new appError(401, "All fields is required"));
    }
    const user = await Users.findOne({ email });
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new appError(401, "Incorrect email or password"));
    }
    createSendToken(user, 200, req, res);
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETKEY, {
    //   expiresIn: "1d",
    // });
    // return res
    //   .status(200)
    //   .cookie("access_token", token, { httpOnly: true })
    //   .json(rest);
  } catch (error) {
    next(error);
  }
};
module.exports.googleSignIn = async (req, res, next) => {
  const { name, email, googlePhotoURL } = req.body;
  if (!email || !name || email === "" || name === "") {
    next(new appError(401, "Something very wrong has been happened"));
  }
  try {
    const user = await Users.findOne({ email });
    if (user) {
      // const newUser = await Users.findOneAndUpdate(
      //   { email },
      //   { profilePicture: googlePhotoURL },
      //   {
      //     new: true,
      //   }
      // );
      createSendToken(user, 200, req, res);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = brcyptjs.hashSync(generatedPassword, 12);
      const newUser = await Users.create({
        username: name,
        email,
        password: hashedPassword,
        profilePicture: googlePhotoURL,
      });
      createSendToken(newUser, 200, req, res);
    }
  } catch (error) {
    next(error);
  }
};
// module.exports.forgotPassword = async (req, res, next) => {
//   const user = await Users.findOne({ email: req.body.email });
//   if (!user) {
//     return next(new appError(404, "There is no user with email address"));
//   }
//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });
//   const resetURL = `${req.protocol}://${req.get(
//     "host"
//   )}/api/auth/resetPassword/${resetToken}`;
//   const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "Your password reset token (valid for 10 min)",
//       message,
//     });

//     res.status(200).json({
//       status: "success",
//       message: "Token sent to email!",
//     });
//   } catch (err) {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     return next(
//       new appError(
//         500,
//         "There was an error sending the email. Try again later!"
//       )
//     );
//   }
// };
// module.exports.resetPassword = async (req, res, next) => {
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const user = await Users.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });

//   // 2) If token has not expired, and there is user, set the new password
//   if (!user) {
//     return next(new appError("Token is invalid or has expired", 400));
//   }
//   if (req.body.password !== req.body.passwordConfirm) {
//     return next(
//       new appError(401, "Password and Password confirm must be the same")
//     );
//   }
//   user.password = req.body.password;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();

//   // 3) Update changedPasswordAt property for the user
//   // 4) Log the user in, send JWT
//   createSendToken(user, 200, res);
// };
exports.updatePassword = async (req, res, next) => {
  try {
    // 1) Get user from collection
    // const user = await Users.findOne({ email: req.body.email });
    const user = await Users.findById(req.user._id);
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new appError(401, "Your current password is wrong."));
    }
    if (req.body.password !== req.body.passwordConfirm) {
      return next(
        new appError(401, "Password and Password confirm must be the same")
      );
    }
    if (req.body.password.length < 8) {
      return next(
        new appError(400, "Password must be at least 8 characters long")
      );
    }
    if (req.body.password.length > 30) {
      return next(
        new appError(400, "Password must be under 30 characters long")
      );
    }
    const hashedPassword = brcyptjs.hashSync(req.body.password, 12);
    user.password = hashedPassword;
    await user.save();
    createSendToken(user, 200, req, res);
  } catch (error) {
    next(error);
  }
};
module.exports.logout = (req, res) => {
  res.cookie("access_token", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.cookie("second_token", "loggedout", {
    expires: new Date(Date.now() + 10 * 10),
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
  res.status(200).json({ status: "success" });
};
module.exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new appError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError(400, "There is no user with email address."));
  }
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new appError(
        500,
        "There was an error sending the email. Try again later!"
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await Users.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new appError(400, "Token is invalid or has expired"));
  }
  if (req.body.password !== req.body.passwordConfirm) {
    return next(
      new appError(401, "Password and Password confirm must be the same")
    );
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
});
