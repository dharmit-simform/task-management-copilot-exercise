import { Router } from 'express';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from '../controllers/task.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { createTaskSchema, updateTaskSchema, taskIdSchema, filterSchema } from '../validators/task.validator';

const router = Router();

// Apply authentication middleware to all task routes
router.use(authenticate);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with optional filtering, search and pagination
 * @access  Private (requires authentication)
 */
router.get('/', validate(filterSchema), getAllTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get task by ID
 * @access  Private (requires authentication)
 */
router.get('/:id', validate(taskIdSchema), getTaskById);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private (requires authentication)
 */
router.post('/', validate(createTaskSchema), createTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a task
 * @access  Private (requires authentication)
 */
router.put('/:id', validate(updateTaskSchema), updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private (requires authentication)
 */
router.delete('/:id', validate(taskIdSchema), deleteTask);

export default router;
