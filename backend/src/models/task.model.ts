export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface ChangeLogEntry {
  timestamp: Date;
  previousTitle?: string;
  newTitle?: string;
  previousDescription?: string;
  newDescription?: string;
}

/**
 * Task entity representing a user's task.
 *
 * @remarks
 * When fetching tasks, urgent tasks are automatically prioritized and appear at the top.
 * A task is considered urgent when:
 * - Priority is set to HIGH
 * - Has a due date defined
 * - Due date is within the next 7 days (inclusive of today)
 *
 * When a task is marked as DONE:
 * - Cannot update: priority, dueDate
 * - Can update: title, description, status
 * - Changes to title/description are logged in changeLog
 */
export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  changeLog?: ChangeLogEntry[];
}

export interface CreateTaskDto {
  userId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMetadata;
}

export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  search?: string;
}
