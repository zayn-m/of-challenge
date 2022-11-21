const { getDb } = require("../config/db");

const paginatedResults = (collection, populate) => async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };
  const db = getDb();
  const model = db.collection(collection);
  // Fields to exclude
  const removeFields = ["sort", "page", "limit", "filter", "search"];

  // Iterate removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  let queryStr = JSON.stringify(reqQuery);

  // Create operators $lt, $lte, $gt etc
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  const search = req.query.search
    ? { $text: { $search: req.query.search } }
    : {};
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  const sort = req.query.sort ? JSON.parse(req.query.sort) : { createdAt: -1 };
  const q = {
    ...JSON.parse(queryStr),
    ...filter,
    ...search
  };
  query = sort ? model.find(q).sort(sort) : model.find(q);

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(skip).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Run query
  const results = await query.toArray();

  // Pagination results
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (skip > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.paginatedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = paginatedResults;
