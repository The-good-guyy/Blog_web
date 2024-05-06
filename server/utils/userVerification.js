const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const appError = require("../utils/appError.js");
const Users = require("../models/userModel");
module.exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    console.log(token);
    if (!token) {
      return next(
        new appError(401, "You are not logged in! Please log in to get access.")
      );
    }
    // jwt.verify(token, process.env.JWT_SECRETKEY, (err, user) => {
    //   if (err) {
    //     return next(new appError(401, "Unauthorized token. Intruder alert"));
    //   }
    //   if (user.changedPasswordAfter(decoded.iat)) {
    //     return next(
    //       new appError(
    //         "User recently changed password! Please log in again.",
    //         401
    //       )
    //     );
    //   }
    //   req.user = user;
    //   next();
    // });
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRETKEY
    );
    const currentUser = await Users.findById(decoded.id);
    if (!currentUser) {
      return next(
        new appError(
          401,
          "The user belonging to this token does no longer exist."
        )
      );
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new appError(
          401,
          "User recently changed password! Please log in again."
        )
      );
    }
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};
