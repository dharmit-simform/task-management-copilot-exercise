import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description:
        "A RESTful API for task management with CRUD operations, pagination, filtering, and search capabilities",
      contact: {
        name: "API Support",
        email: "support@taskmanager.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "User authentication endpoints",
      },
      {
        name: "Tasks",
        description: "Task management endpoints (requires authentication)",
      },
      {
        name: "Health",
        description: "Health check endpoint",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
      },
      schemas: {
        User: {
          type: "object",
          required: ["id", "email", "firstName", "lastName", "createdAt"],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the user",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "john.doe@example.com",
            },
            firstName: {
              type: "string",
              description: "User first name",
              example: "John",
            },
            lastName: {
              type: "string",
              description: "User last name",
              example: "Doe",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "User creation timestamp",
              example: "2024-01-15T10:30:00.000Z",
            },
          },
        },
        SignupRequest: {
          type: "object",
          required: ["email", "firstName", "lastName", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "john.doe@example.com",
            },
            firstName: {
              type: "string",
              minLength: 1,
              maxLength: 50,
              description: "User first name",
              example: "John",
            },
            lastName: {
              type: "string",
              minLength: 1,
              maxLength: 50,
              description: "User last name",
              example: "Doe",
            },
            password: {
              type: "string",
              minLength: 6,
              maxLength: 100,
              format: "password",
              description: "User password (minimum 6 characters)",
              example: "SecurePassword123!",
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "User email address",
              example: "john.doe@example.com",
            },
            password: {
              type: "string",
              format: "password",
              description: "User password",
              example: "SecurePassword123!",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            data: {
              type: "object",
              properties: {
                user: {
                  $ref: "#/components/schemas/User",
                },
                token: {
                  type: "string",
                  description: "JWT authentication token",
                  example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                },
              },
            },
          },
        },
        Task: {
          type: "object",
          required: [
            "id",
            "title",
            "status",
            "priority",
            "createdAt",
            "updatedAt",
          ],
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique identifier for the task",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            userId: {
              type: "string",
              format: "uuid",
              description: "ID of the user who created the task",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            title: {
              type: "string",
              minLength: 1,
              maxLength: 200,
              description: "Task title",
              example: "Implement user authentication",
            },
            description: {
              type: "string",
              maxLength: 1000,
              description: "Task description",
              example:
                "Add JWT-based authentication with login and logout endpoints",
            },
            status: {
              type: "string",
              enum: ["TODO", "IN_PROGRESS", "DONE"],
              description: "Current status of the task",
              example: "TODO",
            },
            priority: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH"],
              description: "Priority level of the task",
              example: "HIGH",
            },
            dueDate: {
              type: "string",
              format: "date",
              description: "Task due date in YYYY-MM-DD format",
              example: "2026-03-15",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Task creation timestamp",
              example: "2024-01-15T10:30:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Task last update timestamp",
              example: "2024-01-15T10:30:00.000Z",
            },
          },
        },
        CreateTask: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              minLength: 1,
              maxLength: 200,
              description: "Task title (required)",
              example: "Implement user authentication",
            },
            description: {
              type: "string",
              maxLength: 1000,
              description: "Task description (optional)",
              example:
                "Add JWT-based authentication with login and logout endpoints",
            },
            status: {
              type: "string",
              enum: ["TODO", "IN_PROGRESS", "DONE"],
              default: "TODO",
              description: "Initial status (optional, default: TODO)",
              example: "TODO",
            },
            priority: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH"],
              default: "MEDIUM",
              description: "Priority level (optional, default: MEDIUM)",
              example: "MEDIUM",
            },
            dueDate: {
              type: "string",
              format: "date",
              pattern: "^\\d{4}-\\d{2}-\\d{2}$",
              description:
                "Task due date in YYYY-MM-DD format (optional). Must not be less than today's date.",
              example: "2026-03-15",
            },
          },
          example: {
            title: "Implement user authentication",
            description:
              "Add JWT-based authentication with login and logout endpoints",
            status: "TODO",
            priority: "HIGH",
            dueDate: "2026-03-15",
          },
        },
        UpdateTask: {
          type: "object",
          properties: {
            title: {
              type: "string",
              minLength: 1,
              maxLength: 200,
              description: "Task title (optional)",
              example: "Implement enhanced user authentication",
            },
            description: {
              type: "string",
              maxLength: 1000,
              description: "Task description (optional)",
              example:
                "Add JWT-based authentication with login and logout endpoints",
            },
            status: {
              type: "string",
              enum: ["TODO", "IN_PROGRESS", "DONE"],
              description: "Task status (optional)",
              example: "IN_PROGRESS",
            },
            priority: {
              type: "string",
              enum: ["LOW", "MEDIUM", "HIGH"],
              description: "Priority level (optional)",
              example: "HIGH",
            },
            dueDate: {
              type: "string",
              format: "date",
              pattern: "^\\d{4}-\\d{2}-\\d{2}$",
              description:
                "Task due date in YYYY-MM-DD format (optional). Must not be less than today's date.",
              example: "2026-03-15",
            },
          },
          minProperties: 1,
          description: "At least one field must be provided for update",
          example: {
            status: "IN_PROGRESS",
            priority: "HIGH",
            dueDate: "2026-03-15",
          },
        },
        PaginationMetadata: {
          type: "object",
          properties: {
            total: {
              type: "integer",
              description: "Total number of tasks",
              example: 50,
            },
            page: {
              type: "integer",
              description: "Current page number",
              example: 1,
            },
            pageSize: {
              type: "integer",
              description: "Number of tasks in current page",
              example: 10,
            },
            totalPages: {
              type: "integer",
              description: "Total number of pages",
              example: 5,
            },
          },
        },
        PaginatedTaskResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Task",
              },
            },
            pagination: {
              $ref: "#/components/schemas/PaginationMetadata",
            },
          },
        },
        TaskResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            data: {
              $ref: "#/components/schemas/Task",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            message: {
              type: "string",
              example: "Task not found",
            },
          },
        },
        ValidationErrorResponse: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            message: {
              type: "string",
              example: "Validation failed",
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                    example: "body.title",
                  },
                  message: {
                    type: "string",
                    example: "Title is required",
                  },
                },
              },
            },
          },
        },
      },
      parameters: {
        TaskId: {
          name: "id",
          in: "path",
          required: true,
          description: "Task UUID",
          schema: {
            type: "string",
            format: "uuid",
          },
        },
        Page: {
          name: "page",
          in: "query",
          description: "Page number (default: 1)",
          schema: {
            type: "integer",
            minimum: 1,
            default: 1,
          },
        },
        Limit: {
          name: "limit",
          in: "query",
          description: "Items per page (default: 10, max: 100)",
          schema: {
            type: "integer",
            minimum: 1,
            maximum: 100,
            default: 10,
          },
        },
        Status: {
          name: "status",
          in: "query",
          description: "Filter by status (comma-separated for multiple)",
          schema: {
            type: "string",
            example: "TODO,IN_PROGRESS",
          },
        },
        Priority: {
          name: "priority",
          in: "query",
          description: "Filter by priority (comma-separated for multiple)",
          schema: {
            type: "string",
            example: "HIGH,MEDIUM",
          },
        },
        Search: {
          name: "search",
          in: "query",
          description: "Search in title and description",
          schema: {
            type: "string",
            maxLength: 100,
            example: "authentication",
          },
        },
      },
      responses: {
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        ValidationError: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ValidationErrorResponse",
              },
            },
          },
        },
        InternalError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        Unauthorized: {
          description: "Authentication required or token invalid",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "error",
                  },
                  message: {
                    type: "string",
                    example:
                      "Authentication required. Please provide a valid Bearer token.",
                  },
                },
              },
            },
          },
        },
      },
    },
    paths: {
      "/auth/signup": {
        post: {
          tags: ["Authentication"],
          summary: "Register a new user",
          description:
            "Create a new user account with email, firstName, lastName, and password",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SignupRequest",
                },
                examples: {
                  complete: {
                    summary: "Complete signup",
                    value: {
                      email: "john.doe@example.com",
                      firstName: "John",
                      lastName: "Doe",
                      password: "SecurePassword123!",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "User created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/AuthResponse",
                  },
                },
              },
            },
            "400": {
              description: "Validation error or email already exists",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ValidationErrorResponse",
                  },
                },
              },
            },
            "500": { $ref: "#/components/responses/InternalError" },
          },
        },
      },
      "/auth/login": {
        post: {
          tags: ["Authentication"],
          summary: "Login user",
          description:
            "Authenticate user with email and password to get JWT token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/LoginRequest",
                },
                examples: {
                  complete: {
                    summary: "Login example",
                    value: {
                      email: "john.doe@example.com",
                      password: "SecurePassword123!",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/AuthResponse",
                  },
                },
              },
            },
            "401": {
              description: "Invalid credentials",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                  examples: {
                    invalidCredentials: {
                      summary: "Invalid credentials",
                      value: {
                        status: "error",
                        message: "Invalid email or password",
                      },
                    },
                  },
                },
              },
            },
            "400": { $ref: "#/components/responses/ValidationError" },
            "500": { $ref: "#/components/responses/InternalError" },
          },
        },
      },
      "/api/tasks": {
        get: {
          tags: ["Tasks"],
          summary: "Get all tasks",
          description:
            "Retrieve all tasks for authenticated user with optional filtering, search, and pagination",
          security: [{ bearerAuth: [] }],
          parameters: [
            { $ref: "#/components/parameters/Page" },
            { $ref: "#/components/parameters/Limit" },
            { $ref: "#/components/parameters/Status" },
            { $ref: "#/components/parameters/Priority" },
            { $ref: "#/components/parameters/Search" },
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/PaginatedTaskResponse",
                  },
                  examples: {
                    withFilters: {
                      summary: "Filtered and paginated tasks",
                      value: {
                        status: "success",
                        data: [
                          {
                            id: "550e8400-e29b-41d4-a716-446655440000",
                            title: "Implement user authentication",
                            description: "Add JWT-based authentication",
                            status: "TODO",
                            priority: "HIGH",
                            createdAt: "2024-01-15T10:30:00.000Z",
                            updatedAt: "2024-01-15T10:30:00.000Z",
                          },
                        ],
                        pagination: {
                          total: 50,
                          page: 1,
                          pageSize: 1,
                          totalPages: 50,
                        },
                      },
                    },
                  },
                },
              },
            },
            "400": { $ref: "#/components/responses/ValidationError" },
            "500": { $ref: "#/components/responses/InternalError" },
          },
        },
        post: {
          tags: ["Tasks"],
          summary: "Create a new task",
          description: "Create a new task for the authenticated user",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/CreateTask",
                },
                examples: {
                  minimal: {
                    summary: "Minimal task (only title required)",
                    value: {
                      title: "Implement user authentication",
                    },
                  },
                  withDescription: {
                    summary: "Task with title and description",
                    value: {
                      title: "Build responsive dashboard",
                      description:
                        "Create a responsive dashboard with charts and analytics",
                    },
                  },
                  withStatus: {
                    summary: "Task with custom status",
                    value: {
                      title: "Fix login bug",
                      description: "Resolve authentication timeout issue",
                      status: "IN_PROGRESS",
                    },
                  },
                  complete: {
                    summary: "Complete task (all fields)",
                    value: {
                      title: "Implement user authentication",
                      description:
                        "Add JWT-based authentication with login and logout endpoints",
                      status: "TODO",
                      priority: "HIGH",
                    },
                  },
                  highPriority: {
                    summary: "High priority task",
                    value: {
                      title: "Critical security patch",
                      description:
                        "Apply security updates to authentication module",
                      status: "TODO",
                      priority: "HIGH",
                    },
                  },
                  lowPriority: {
                    summary: "Low priority task",
                    value: {
                      title: "Update documentation",
                      description:
                        "Update API documentation with new endpoints",
                      status: "TODO",
                      priority: "LOW",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "201": {
              description: "Task created successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/TaskResponse",
                  },
                },
              },
            },
            "400": { $ref: "#/components/responses/ValidationError" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "500": { $ref: "#/components/responses/InternalError" },
          },
        },
      },
      "/api/tasks/{id}": {
        get: {
          tags: ["Tasks"],
          summary: "Get task by ID",
          description:
            "Retrieve a specific task by its UUID (only if owned by authenticated user)",
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: "#/components/parameters/TaskId" }],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/TaskResponse",
                  },
                },
              },
            },
            "400": { $ref: "#/components/responses/ValidationError" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "404": { $ref: "#/components/responses/NotFound" },
            "500": { $ref: "#/components/responses/InternalError" },
          },
        },
        put: {
          tags: ["Tasks"],
          summary: "Update a task",
          description:
            "Update an existing task by its UUID (only if owned by authenticated user). At least one field must be provided.",
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: "#/components/parameters/TaskId" }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UpdateTask",
                },
                examples: {
                  updateStatus: {
                    summary: "Update only status",
                    value: {
                      status: "IN_PROGRESS",
                    },
                  },
                  updatePriority: {
                    summary: "Update only priority",
                    value: {
                      priority: "HIGH",
                    },
                  },
                  updateTitle: {
                    summary: "Update only title",
                    value: {
                      title: "Implement enhanced user authentication",
                    },
                  },
                  markAsDone: {
                    summary: "Mark task as done",
                    value: {
                      status: "DONE",
                    },
                  },
                  updateMultiple: {
                    summary: "Update multiple fields",
                    value: {
                      title: "Implement enhanced user authentication",
                      description:
                        "Add JWT-based authentication with OAuth2 support",
                      status: "IN_PROGRESS",
                      priority: "HIGH",
                    },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Task updated successfully",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/TaskResponse",
                  },
                },
              },
            },
            "400": { $ref: "#/components/responses/ValidationError" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "404": { $ref: "#/components/responses/NotFound" },
            "500": { $ref: "#/components/responses/InternalError" },
          },
        },
        delete: {
          tags: ["Tasks"],
          summary: "Delete a task",
          description:
            "Delete a task by its UUID (only if owned by authenticated user)",
          security: [{ bearerAuth: [] }],
          parameters: [{ $ref: "#/components/parameters/TaskId" }],
          responses: {
            "204": {
              description: "Task deleted successfully",
            },
            "400": { $ref: "#/components/responses/ValidationError" },
            "401": { $ref: "#/components/responses/Unauthorized" },
            "404": { $ref: "#/components/responses/NotFound" },
            "500": { $ref: "#/components/responses/InternalError" },
          },
        },
      },
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Health check",
          description: "Check if the API is running",
          responses: {
            "200": {
              description: "API is healthy",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: {
                        type: "string",
                        example: "ok",
                      },
                      timestamp: {
                        type: "string",
                        format: "date-time",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
