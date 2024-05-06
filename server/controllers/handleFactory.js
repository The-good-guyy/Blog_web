const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // const doc = await Model.findByIdAndDelete(req.params.id);
    const doc = await Model.deleteOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!doc) {
      return next(new appError(404, "No document found with that ID"));
    }
    console.log(doc);
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
exports.deleteOneAdmin = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new appError(404, "No document found with that ID"));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
exports.updateOneAdmin = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    const doc = await Model.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
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
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

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

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};

    filter = {
      // ...(req.query.userId && {
      //   userId: req.query.userId,
      // }),
      // ...(req.query.category && { category: req.query.category }),
      // ...(req.query.slug && { slug: req.query.slug }),
      // ...(req.query.postId && { postId: req.query.postId }),
      ...(req.query.searchTerm && { $text: { $search: req.query.searchTerm } }),
    };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;
    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: { data: doc },
    });
  });
exports.countAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    filter = {
      ...(req.query.userId && {
        userId: req.query.userId,
      }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { postId: req.query.postId }),
      ...(req.query.searchTerm && { $text: { $search: req.query.searchTerm } }),
    };
    const count = await Model.find(filter).countDocuments();
    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      data: { data: count },
    });
  });
