import { z } from 'zod';
import { TaskStatus, TaskPriority } from '../models/task.model';

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string({ message: 'Title must be a string' })
      .min(1, 'Title cannot be empty')
      .max(200, 'Title must be less than 200 characters')
      .transform(val => val.trim()),
    description: z
      .string()
      .max(1000, 'Description must be less than 1000 characters')
      .transform(val => val.trim())
      .optional(),
    status: z
      .nativeEnum(TaskStatus, { message: 'Status must be one of: TODO, IN_PROGRESS, DONE' })
      .optional()
      .default(TaskStatus.TODO),
    priority: z
      .nativeEnum(TaskPriority, { message: 'Priority must be one of: LOW, MEDIUM, HIGH' })
      .optional()
      .default(TaskPriority.MEDIUM),
    dueDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
      .refine(
        val => {
          const dueDate = new Date(val);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return dueDate >= today;
        },
        'Due date cannot be less than today\'s date'
      )
      .optional()
  })
});

export const updateTaskSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'Task ID must be a string' })
      .uuid('Task ID must be a valid UUID')
  }),
  body: z.object({
    title: z
      .string()
      .min(1, 'Title cannot be empty')
      .max(200, 'Title must be less than 200 characters')
      .transform(val => val.trim())
      .optional(),
    description: z
      .string()
      .max(1000, 'Description must be less than 1000 characters')
      .transform(val => val.trim())
      .optional(),
    status: z
      .nativeEnum(TaskStatus, { message: 'Status must be one of: TODO, IN_PROGRESS, DONE' })
      .optional(),
    priority: z
      .nativeEnum(TaskPriority, { message: 'Priority must be one of: LOW, MEDIUM, HIGH' })
      .optional(),
    dueDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be in YYYY-MM-DD format')
      .refine(
        val => {
          const dueDate = new Date(val);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return dueDate >= today;
        },
        'Due date cannot be less than today\'s date'
      )
      .optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
  })
});

export const taskIdSchema = z.object({
  params: z.object({
    id: z
      .string({ message: 'Task ID must be a string' })
      .uuid('Task ID must be a valid UUID')
  })
});

export const paginationSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .default('1')
      .transform(val => parseInt(val, 10))
      .refine(val => val > 0, 'Page must be greater than 0'),
    limit: z
      .string()
      .optional()
      .default('10')
      .transform(val => parseInt(val, 10))
      .refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100')
  })
});

export const filterSchema = z.object({
  query: z.object({
    status: z
      .string()
      .optional()
      .transform(val => {
        if (!val) return undefined;
        return val.split(',').map(s => s.trim().toUpperCase());
      })
      .refine(
        val => {
          if (!val) return true;
          return val.every(s => Object.values(TaskStatus).includes(s as TaskStatus));
        },
        'Invalid status value. Must be one of: TODO, IN_PROGRESS, DONE'
      ),
    priority: z
      .string()
      .optional()
      .transform(val => {
        if (!val) return undefined;
        return val.split(',').map(p => p.trim().toUpperCase());
      })
      .refine(
        val => {
          if (!val) return true;
          return val.every(p => Object.values(TaskPriority).includes(p as TaskPriority));
        },
        'Invalid priority value. Must be one of: LOW, MEDIUM, HIGH'
      ),
    search: z
      .string()
      .max(100, 'Search term must be less than 100 characters')
      .transform(val => val.trim())
      .optional(),
    page: z
      .string()
      .optional()
      .default('1')
      .transform(val => parseInt(val, 10))
      .refine(val => val > 0, 'Page must be greater than 0'),
    limit: z
      .string()
      .optional()
      .default('10')
      .transform(val => parseInt(val, 10))
      .refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100')
  })
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdInput = z.infer<typeof taskIdSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type FilterInput = z.infer<typeof filterSchema>;
