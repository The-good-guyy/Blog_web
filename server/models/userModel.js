const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");
const brcyptjs = require("bcryptjs");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add a username"],
      // unique: [true, "That username has been taken."],
      min: 5,
      max: 40,
    },
    bio: {
      type: String,
      max: 240,
    },
    email: {
      type: String,
      required: [true, "Please add an email address"],
      unique: [true, "This email is already in use"],
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Must be a Valid Email",
      },
      max: 254,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    twitterURL: {
      type: String,
      unique: false,
      validate: {
        validator: function (value) {
          return (
            validator.isURL(value, {
              protocols: ["http", "https", "ftp"],
              require_tld: true,
              require_protocol: true,
            }) && validator.contains(value, "twitter")
          );
        },
        message: "Must be a Valid Twitter URL",
      },
      default: "https://twitter.com/example",
    },
    githubURL: {
      type: String,
      index: true,
      validate: {
        validator: function (value) {
          return (
            validator.isURL(value, {
              protocols: ["http", "https", "ftp"],
              require_tld: true,
              require_protocol: true,
            }) && validator.contains(value, "github")
          );
        },
        message: "Must be a Valid Github URL",
      },
      default: "https://github.com/example",
    },
    linkedinURL: {
      type: String,
      index: true,
      validate: {
        validator: function (value) {
          return (
            validator.isURL(value, {
              protocols: ["http", "https", "ftp"],
              require_tld: true,
              require_protocol: true,
            }) && validator.contains(value, "linkedin")
          );
        },
        message: "Must be a Valid Linkedin URL",
      },
      default: "https://linkedin.com/example",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);
userSchema.path("profilePicture").validate(function (value) {
  if (
    validator.isURL(value, {
      protocols: ["http", "https", "ftp"],
      require_tld: true,
      require_protocol: true,
    })
  ) {
    return true;
  }
  throw new error("Invalid profile picture URL");
}, "Invalid profile picture URL");
// userSchema.post("save", function (error, doc, next) {
//   console.log(error);
//   if (error.name === "MongoServerError" && error.code === 11000) {
//     if (Object.keys(error.keyValue)[0] === "username") {
//       next(new Error("Username had been already taken"));
//     }
//     if (Object.keys(error.keyValue)[0] === "email") {
//       next(new Error("Email had been already taken"));
//     }
//     next(new Error("There was a duplicate key error"));
//   } else {
//     next();
//   }
// });
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await brcyptjs.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
module.exports = mongoose.model("Users", userSchema);
