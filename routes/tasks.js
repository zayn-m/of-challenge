const express = require('express');
const router = express.Router();

const tasksController = require('../controller/task.controller');
const paginatedResults = require('../middleware/paginatedResults');
const validationErrors = require('../middleware/validate');

router.route('/').get(paginatedResults('tasks'), tasksController.listTasks);
router.route('/').post(validationErrors('required',['name', 'startDate', 'dueDate', 'endDate']), tasksController.createTask);
router.route('/:id').put(tasksController.updateTask);
router.route('/:id').delete(tasksController.deleteTask);

module.exports = router;