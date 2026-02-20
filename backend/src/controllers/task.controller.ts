import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authenticate';
import { taskService } from '../services/task.service';
import { TaskStatus, TaskPriority, TaskFilters } from '../models/task.model';

export const getAllTasks = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { page, limit, status, priority, search } = req.query;

    const filters: TaskFilters = {};
    if (status) {
      filters.status = (status as string).split(',').map(s => s.trim() as TaskStatus);
    }
    if (priority) {
      filters.priority = (priority as string).split(',').map(p => p.trim() as TaskPriority);
    }
    if (search) {
      filters.search = search as string;
    }

    const pagination = {
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 10
    };

    const result = taskService.getAllTasks(userId, filters, pagination);

    res.status(200).json({
      status: 'success',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const task = taskService.getTaskById(id, userId);

    res.status(200).json({
      status: 'success',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const task = taskService.createTask(userId, req.body);

    res.status(201).json({
      status: 'success',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const task = taskService.updateTask(id, userId, req.body);

    res.status(200).json({
      status: 'success',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    taskService.deleteTask(id, userId);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
