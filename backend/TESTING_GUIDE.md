# Task Management API - Testing Guide

## Quick Start

### 1. Start the Server
```bash
cd backend
npm run dev
```

The server will start on **http://localhost:5000**

### 2. Access Swagger Documentation
Open your browser and go to:
**http://localhost:5000/api-docs**

This interactive documentation allows you to test all API endpoints directly from the browser!

## API Endpoints Overview

### Base URL
```
http://localhost:5000
```

### Health Check
- **GET** `/health` - Check if API is running

### Task Management
- **GET** `/api/tasks` - Get all tasks (with pagination, filtering, search)
- **GET** `/api/tasks/:id` - Get task by ID
- **POST** `/api/tasks` - Create new task
- **PUT** `/api/tasks/:id` - Update task
- **DELETE** `/api/tasks/:id` - Delete task

## Testing with cURL

### 1. Create Tasks

```bash
# Create a simple task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implement user authentication"
  }'

# Create a complete task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build responsive dashboard",
    "description": "Create a responsive dashboard with charts and analytics",
    "status": "TODO",
    "priority": "HIGH"
  }'

# Create multiple tasks
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Fix login bug", "status": "IN_PROGRESS", "priority": "HIGH"}'

curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Update documentation", "status": "TODO", "priority": "LOW"}'

curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Review pull requests", "status": "TODO", "priority": "MEDIUM"}'
```

### 2. Get All Tasks

```bash
# Get all tasks
curl http://localhost:5000/api/tasks

# With pagination
curl "http://localhost:5000/api/tasks?page=1&limit=10"

# Filter by status
curl "http://localhost:5000/api/tasks?status=TODO"

# Filter by multiple statuses
curl "http://localhost:5000/api/tasks?status=TODO,IN_PROGRESS"

# Filter by priority
curl "http://localhost:5000/api/tasks?priority=HIGH"

# Search in title and description
curl "http://localhost:5000/api/tasks?search=authentication"

# Combined filters
curl "http://localhost:5000/api/tasks?status=TODO&priority=HIGH&search=bug&page=1&limit=5"
```

### 3. Get Task by ID

```bash
# Replace {task-id} with actual UUID from created task
curl http://localhost:5000/api/tasks/{task-id}
```

### 4. Update Task

```bash
# Update status only
curl -X PUT http://localhost:5000/api/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS"
  }'

# Update multiple fields
curl -X PUT http://localhost:5000/api/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Enhanced user authentication",
    "status": "DONE",
    "priority": "HIGH"
  }'
```

### 5. Delete Task

```bash
curl -X DELETE http://localhost:5000/api/tasks/{task-id}
```

## Testing Validation

### Test Invalid Data

```bash
# Missing required title
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{}'

# Title too long (max 200 characters)
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "'$(python3 -c "print('a' * 201)")'"
  }'

# Invalid status
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test task",
    "status": "INVALID_STATUS"
  }'

# Invalid UUID format
curl http://localhost:5000/api/tasks/invalid-uuid

# Empty update request
curl -X PUT http://localhost:5000/api/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Response Examples

### Successful Task Creation (201)
```json
{
  "status": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Implement user authentication",
    "description": "Add JWT-based authentication",
    "status": "TODO",
    "priority": "HIGH",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Paginated Task List (200)
```json
{
  "status": "success",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Implement user authentication",
      "status": "TODO",
      "priority": "HIGH",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5
  }
}
```

### Validation Error (400)
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "body.title",
      "message": "Title is required"
    }
  ]
}
```

### Not Found Error (404)
```json
{
  "status": "error",
  "message": "Task not found"
}
```

## Advanced Features

### 1. Pagination
- **page**: Page number (default: 1, min: 1)
- **limit**: Items per page (default: 10, max: 100)

Example: `?page=2&limit=20`

### 2. Filtering
- **status**: Filter by status (comma-separated for multiple)
  - Values: `TODO`, `IN_PROGRESS`, `DONE`
  - Example: `?status=TODO,IN_PROGRESS`

- **priority**: Filter by priority (comma-separated for multiple)
  - Values: `LOW`, `MEDIUM`, `HIGH`
  - Example: `?priority=HIGH,MEDIUM`

### 3. Text Search
- **search**: Search in title and description (case-insensitive)
  - Example: `?search=authentication`

### 4. Combined Operations
You can combine all features:
```bash
curl "http://localhost:5000/api/tasks?status=TODO&priority=HIGH&search=bug&page=1&limit=5"
```

## Task Properties

### Required Fields
- **title**: String (1-200 characters)

### Optional Fields
- **description**: String (max 1000 characters)
- **status**: Enum (`TODO`, `IN_PROGRESS`, `DONE`) - Default: `TODO`
- **priority**: Enum (`LOW`, `MEDIUM`, `HIGH`) - Default: `MEDIUM`

### Auto-Generated Fields
- **id**: UUID (auto-generated)
- **createdAt**: ISO 8601 timestamp
- **updatedAt**: ISO 8601 timestamp

## Request Logging

All requests are automatically logged with:
- Request ID (for tracing)
- HTTP method
- URL path
- Status code
- Response time in milliseconds

Example log output:
```
abc123xyz456 GET /api/tasks 200 45 - 12.345 ms
```

## Error Codes

- **200**: Success
- **201**: Created
- **204**: No Content (successful deletion)
- **400**: Bad Request (validation error)
- **404**: Not Found
- **500**: Internal Server Error

## Testing Checklist

- [ ] Create task with minimal data (title only)
- [ ] Create task with all fields
- [ ] Get all tasks
- [ ] Get tasks with pagination
- [ ] Filter by status
- [ ] Filter by priority
- [ ] Search by text
- [ ] Combine filters with pagination
- [ ] Get task by ID
- [ ] Update task (partial update)
- [ ] Delete task
- [ ] Test validation errors
- [ ] Test 404 errors (invalid ID)
- [ ] Verify response times are acceptable
- [ ] Check Swagger documentation loads

## Next Steps

1. Open **http://localhost:5000/api-docs** in your browser
2. Use the "Try it out" feature to test each endpoint
3. Explore the interactive examples
4. Test edge cases and error scenarios
5. Verify pagination and filtering work correctly

Enjoy testing your Task Management API! 🚀
