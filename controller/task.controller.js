const { ObjectId } = require("mongodb");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const { dateIsValid } = require("../utils/helper");
const baseController = require("./base.controller");

// @desc    List all tasks
// @route   GET /api/tasks
// @access  Public
exports.listTasks = asyncHandler(async (req, res) => {
  res.status(200).json(res.paginatedResults);
});

// @desc    Create new task document
// @route   POST /api/tasks
// @access  Public
exports.createTask = asyncHandler(async (req, res, next) => {
  if (
    !dateIsValid(req.body.startDate) ||
    !dateIsValid(req.body.endDate) ||
    !dateIsValid(req.body.dueDate)
  ) {
    return next(new ErrorResponse("Invalid date format, use YYYY-MM-DD", 400))
  }

  let project = null;

  const document = {
    name: req.body.name,
    startDate: new Date(req.body.startDate),
    endDate: new Date(req.body.endDate),
    dueDate: new Date(req.body.dueDate),
    completed: false,
    createdAt: new Date(),
  };

  if (req.body.projectId) {
    project = await baseController.findByIdOrFail(
      "projects",
      req.body.projectId,
      next
    );
    document.projectId = new ObjectId(project._id);
  }

  const task = await baseController.create("tasks", document, next);
  res.status(201).json(task);
});

// @desc    Update existing task
// @route   PUT /api/tasks/:id
// @access  Public
exports.updateTask = asyncHandler(async (req, res, next) => {      
  let task = await baseController.findByIdOrFail("tasks", req.params.id, next);

  if (task.completed && req.body.completed) {
    return next(new ErrorResponse("Task is already marked as completed", 400));
  }

  const document = {
    name: req.body.name || task.name,
    startDate: req.body.startDate ? new Date(req.body.startDate) : task.startDate,
    endDate: req.body.endDate ? new Date(req.body.endDate) : task.endDate,
    dueDate: req.body.dueDate ? new Date(req.body.dueDate) : task.dueDate,
    completed: req.body.completed || task.completed,
  };

  task = await baseController.update("tasks", req.params.id, document, next);
  res.status(201).json(task);
});

// @desc    Delete an existing task by id
// @route   DELETE /api/tasks/:id
// @access  Public
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await baseController.delete("tasks", req.params.id, next);
  res.status(200).json(task);
});
