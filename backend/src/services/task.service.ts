import {
  ChangeLogEntry,
  CreateTaskDto,
  PaginatedResponse,
  PaginationMetadata,
  PaginationParams,
  Task,
  TaskFilters,
  TaskStatus,
  UpdateTaskDto,
} from "../models/task.model";
import { taskRepository } from "../repositories/task.repository";

export class TaskService {
  createTask(
    userId: string,
    createTaskDto: Omit<CreateTaskDto, "userId">,
  ): Task {
    return taskRepository.create({ ...createTaskDto, userId });
  }

  getAllTasks(
    userId: string,
    filters?: TaskFilters,
    pagination?: PaginationParams,
  ): PaginatedResponse<Task> {
    const { tasks, total } = taskRepository.findAll(
      userId,
      filters,
      pagination,
    );

    const paginationMetadata: PaginationMetadata = {
      total,
      page: pagination?.page || 1,
      pageSize: tasks.length,
      totalPages: pagination ? Math.ceil(total / pagination.limit) : 1,
    };

    return {
      data: tasks,
      pagination: paginationMetadata,
    };
  }

  getTaskById(id: string, userId: string): Task {
    const task = taskRepository.findByIdAndUserId(id, userId);

    if (!task) {
      const error: any = new Error(
        "Task not found or you do not have permission to access it",
      );
      error.statusCode = 404;
      throw error;
    }

    return task;
  }

  updateTask(id: string, userId: string, updateTaskDto: UpdateTaskDto): Task {
    const existingTask = taskRepository.findByIdAndUserId(id, userId);

    if (!existingTask) {
      const error: any = new Error(
        "Task not found or you do not have permission to update it",
      );
      error.statusCode = 404;
      throw error;
    }

    // If task is marked as DONE, validate what fields can be updated
    if (existingTask.status === TaskStatus.DONE) {
      // Check if trying to update restricted fields (priority, dueDate)
      if (
        updateTaskDto.priority !== undefined ||
        updateTaskDto.dueDate !== undefined
      ) {
        const error: any = new Error(
          "Cannot update priority or dueDate for a task that is marked as DONE. Only title and description can be updated.",
        );
        error.statusCode = 400;
        throw error;
      }

      // If updating title or description, create a change log entry
      if (
        updateTaskDto.title !== undefined ||
        updateTaskDto.description !== undefined
      ) {
        const changeLogEntry: ChangeLogEntry = {
          timestamp: new Date(),
          previousTitle: existingTask.title,
          newTitle: updateTaskDto.title || existingTask.title,
          previousDescription: existingTask.description,
          newDescription:
            updateTaskDto.description !== undefined
              ? updateTaskDto.description
              : existingTask.description,
        };

        // Pass the change log entry to the repository
        const task = taskRepository.updateWithChangeLog(
          id,
          userId,
          updateTaskDto,
          changeLogEntry,
        );

        if (!task) {
          const error: any = new Error(
            "Task not found or you do not have permission to update it",
          );
          error.statusCode = 404;
          throw error;
        }

        return task;
      }
    }

    // Normal update for non-DONE tasks
    const task = taskRepository.update(id, userId, updateTaskDto);

    if (!task) {
      const error: any = new Error(
        "Task not found or you do not have permission to update it",
      );
      error.statusCode = 404;
      throw error;
    }

    return task;
  }

  deleteTask(id: string, userId: string): void {
    const deleted = taskRepository.delete(id, userId);

    if (!deleted) {
      const error: any = new Error(
        "Task not found or you do not have permission to delete it",
      );
      error.statusCode = 404;
      throw error;
    }
  }
}

export const taskService = new TaskService();
