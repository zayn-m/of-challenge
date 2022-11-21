// Base controller file to handle CRUD operations

const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");
const ErrorResponse = require("../utils/errorResponse");

/**
 * Find a record by id or fail
 * @param {string} collection Collection name
 * @param {string} id Id string of object
 * @param {Func} next Next function
 */
exports.findByIdOrFail = async (collection, id, next) => {
    const db = getDb();
    const record = await db.collection(collection).findOne({ _id: new ObjectId(id) });

    if (!record) {
        return next(new ErrorResponse(`Record not found with id ${id}`, 404));
    }
    return {
      ...record,
      _id: record._id.toString()
    }
}

/**
 * Create a new record in collection
 * @param {string} collection Collection name
 * @param {object} input Input object
 * @param {Func} next Next function
 */
exports.create = async (collection, input, next) => {
  const db = getDb();
  return db.collection(collection).insertOne(input); 
};

/**
 * Updates an existing record by id
 * @param {string} collection Collection name
 * @param {string} id Id string of object
 * @param {object} input Input object
 * @param {Func} next Next function
 */
exports.update = async (collection, id, input, next) => {
  const db = getDb();
  let record = await this.findByIdOrFail(collection, id, next);

  record = await db
    .collection(collection)
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: input },
      { upsert: true }
    );
  return record;
};

/**
 * Delete a record by id
 * @param {string} collection Collection name
 * @param {string} id Id string of object
 * @param {Func} next Next function
 */
exports.delete = async (collection, id, next) => {
  const db = getDb();
  let record = await this.findByIdOrFail(collection, id, next);

  await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
  return record;
};
