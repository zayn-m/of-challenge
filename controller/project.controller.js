const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const { dateIsValid } = require("../utils/helper");
const baseController = require("./base.controller");

// @desc    List all projects
// @route   GET /api/projects
// @access  Public
exports.listProjects = asyncHandler(async (req, res) => {
  res.status(200).json(res.paginatedResults);
});

// @desc    Create new project document
// @route   POST /api/projects
// @access  Public
exports.createProject = asyncHandler(async (req, res, next) => {
    if (
        !dateIsValid(req.body.startDate) ||
        !dateIsValid(req.body.dueDate)
    ) {
        return next(new ErrorResponse("Invalid date format, use YYYY-MM-DD", 400))
    }

  const document = {
    name: req.body.name,
    startDate: new Date(req.body.startDate),
    dueDate: new Date(req.body.dueDate),
    createdAt: new Date(),
  };
  const project = await baseController.create("projects", document, next);
  res.status(201).json(project);
});

// @desc    Update existing project
// @route   PUT /api/projects/:id
// @access  Public
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await baseController.findByIdOrFail("projects", req.params.id, next);

  const document = {
    name: req.body.name || project.name,
  };

  project = await baseController.update("projects", req.params.id, document, next);
  res.status(201).json(project);
});

// @desc    Delete an existing project by id
// @route   DELETE /api/projects/:id
// @access  Public
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await baseController.delete("projects", req.params.id, next);
  res.status(200).json(project);
});

// @desc    Assign a task to project
// @route   POST /api/projects/assign/:id
// @access  Public
exports.assignTask = asyncHandler(async (req, res, next) => {
    const project = await baseController.findByIdOrFail("projects", req.params.id, next);
    const task = await baseController.findByIdOrFail("tasks", req.body.taskId, next);

    // Checking if task is already assigned or to some other project
    if (task.projectId && task.projectId.toString() === project._id) {
        return next(new ErrorResponse("Task is already to this project", 400));
    }

    const db = getDb();
    // Find already assigned project of task and if found then unassign task
    const oldProject = await db.collection("projects").findOne({ _id: new ObjectId(task._id)});

    if (oldProject) {
        await baseController.update("projects", oldProject._id, { projectId: null }, next);
    }    
   
    const updatedTask = await baseController.update("tasks", task._id, { projectId: new ObjectId(project._id) } )
    res.status(200).json(updatedTask);
  });
  