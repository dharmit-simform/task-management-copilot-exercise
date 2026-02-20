import { v4 as uuidv4 } from "uuid";
import {
  ChangeLogEntry,
  CreateTaskDto,
  PaginationParams,
  Task,
  TaskFilters,
  TaskPriority,
  TaskStatus,
  UpdateTaskDto,
} from "../models/task.model";

export class TaskRepository {
  private tasks: Map<string, Task> = new Map();

  create(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: uuidv4(),
      userId: createTaskDto.userId,
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: createTaskDto.status || TaskStatus.TODO,
      priority: createTaskDto.priority || TaskPriority.MEDIUM,
      dueDate: createTaskDto.dueDate
        ? new Date(createTaskDto.dueDate)
        : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      changeLog: [],
    };

    this.tasks.set(task.id, task);
    return task;
  }

  findAll(
    userId: string,
    filters?: TaskFilters,
    pagination?: PaginationParams,
  ): { tasks: Task[]; total: number } {
    let tasksArray = Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId,
    );

    if (filters) {
      tasksArray = this.applyFilters(tasksArray, filters);
    }

    // Apply automatic sorting to prioritize urgent tasks
    tasksArray = this.applySorting(tasksArray);

    const total = tasksArray.length;

    if (pagination) {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;
      tasksArray = tasksArray.slice(skip, skip + limit);
    }

    return { tasks: tasksArray, total };
  }

  findById(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  findByIdAndUserId(id: string, userId: string): Task | undefined {
    const task = this.tasks.get(id);
    if (task && task.userId === userId) {
      return task;
    }
    return undefined;
  }

  update(
    id: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
  ): Task | undefined {
    const task = this.findByIdAndUserId(id, userId);

    if (!task) {
      return undefined;
    }

    const updatedTask: Task = {
      ...task,
      ...updateTaskDto,
      dueDate:
        updateTaskDto.dueDate !== undefined
          ? updateTaskDto.dueDate
            ? new Date(updateTaskDto.dueDate)
            : undefined
          : task.dueDate,
      updatedAt: new Date(),
    };

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  updateWithChangeLog(
    id: string,
    userId: string,
    updateTaskDto: UpdateTaskDto,
    changeLogEntry: ChangeLogEntry,
  ): Task | undefined {
    const task = this.findByIdAndUserId(id, userId);

    if (!task) {
      return undefined;
    }

    // Append the change log entry
    const changeLog = task.changeLog || [];
    changeLog.push(changeLogEntry);

    const updatedTask: Task = {
      ...task,
      title:
        updateTaskDto.title !== undefined ? updateTaskDto.title : task.title,
      description:
        updateTaskDto.description !== undefined
          ? updateTaskDto.description
          : task.description,
      status:
        updateTaskDto.status !== undefined ? updateTaskDto.status : task.status,
      priority:
        updateTaskDto.priority !== undefined
          ? updateTaskDto.priority
          : task.priority,
      dueDate:
        updateTaskDto.dueDate !== undefined
          ? updateTaskDto.dueDate
            ? new Date(updateTaskDto.dueDate)
            : undefined
          : task.dueDate,
      changeLog,
      updatedAt: new Date(),
    };

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  delete(id: string, userId: string): boolean {
    const task = this.findByIdAndUserId(id, userId);

    if (!task) {
      return false;
    }

    return this.tasks.delete(id);
  }

  private applyFilters(tasks: Task[], filters: TaskFilters): Task[] {
    return tasks.filter((task) => {
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(task.status)) {
          return false;
        }
      }

      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(task.priority)) {
          return false;
        }
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(searchLower);
        const descriptionMatch =
          task.description?.toLowerCase().includes(searchLower) || false;

        if (!titleMatch && !descriptionMatch) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Automatically sorts tasks to prioritize urgent items.
   * Urgent tasks (HIGH priority with due dates within 7 days) appear first,
   * followed by all other tasks in their original order.
   */
  private applySorting(tasks: Task[]): Task[] {
    const urgentTasks: Task[] = [];
    const normalTasks: Task[] = [];

    tasks.forEach((task) => {
      if (this.isUrgentTask(task)) {
        urgentTasks.push(task);
      } else {
        normalTasks.push(task);
      }
    });

    // Sort urgent tasks by due date (earliest first)
    urgentTasks.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      return 0;
    });

    // Return urgent tasks first, then normal tasks
    return [...urgentTasks, ...normalTasks];
  }

  /**
   * Determines if a task is urgent based on priority and due date.
   * A task is urgent if:
   * - Priority is HIGH
   * - Has a due date set
   * - Due date is within the next 7 days (inclusive)
   */
  private isUrgentTask(task: Task): boolean {
    if (task.priority !== TaskPriority.HIGH || !task.dueDate) {
      return false;
    }

    return this.isWithinSevenDays(task.dueDate);
  }

  /**
   * Checks if a date is within the next 7 days from today (inclusive).
   * Comparison is done at the date level (ignoring time).
   */
  private isWithinSevenDays(dueDate: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    return due >= today && due <= sevenDaysFromNow;
  }
}

export const taskRepository = new TaskRepository();
