const express = require('express');
const router = express.Router();

const projectController = require('../controller/project.controller');
const paginatedResults = require('../middleware/paginatedResults');
const validationErrors = require('../middleware/validate');

router.route('/').get(paginatedResults('projects'), projectController.listProjects);
router.route('/').post(validationErrors('required', ['name', 'startDate', 'dueDate']), projectController.createProject);
router.route('/:id').put(projectController.updateProject);
router.route('/:id').delete(projectController.deleteProject);
router.route('/assign/:id').post(projectController.assignTask);

module.exports = router;