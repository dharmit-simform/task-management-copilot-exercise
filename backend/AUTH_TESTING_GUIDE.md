# Authentication Module - Testing Guide

## Overview
The Task Management API now includes **user authentication and authorization**. All task operations are protected and scoped to authenticated users.

## Authentication Flow

### 1. User Signup
Create a new user account with email, firstName, lastName, and password.

```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "SecurePassword123!"
  }'
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. User Login
Authenticate with email and password to receive a JWT token.

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123!"
  }'
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Save Your Token
Copy the token from the response. You'll need it for all task operations!

## Using Protected Endpoints

All task endpoints now require authentication. Include the JWT token in the **Authorization** header:

```bash
Authorization: Bearer <your-token-here>
```

### Create a Task (Authenticated)

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "title": "Build authentication module",
    "description": "Implement JWT-based authentication",
    "status": "IN_PROGRESS",
    "priority": "HIGH"
  }'
```

### Get All Tasks (Your Tasks Only)

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/api/tasks
```

**Note:** You'll only see tasks that YOU created!

### Get Task by ID

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/api/tasks/{task-id}
```

### Update Task (Only Your Tasks)

```bash
curl -X PUT http://localhost:5000/api/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "status": "DONE"
  }'
```

**Authorization:** You can only update tasks you created!

### Delete Task (Only Your Tasks)

```bash
curl -X DELETE \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:5000/api/tasks/{task-id}
```

**Authorization:** You can only delete tasks you created!

## Testing with Swagger UI

### Setup
1. Open: **http://localhost:5000/api-docs**
2. Find the **Authentication** section
3. Click on **POST /auth/signup** or **POST /auth/login**

### Get Your Token
1. Click **"Try it out"**
2. Fill in the request body
3. Click **"Execute"**
4. Copy the **token** from the response

### Authorize All Requests
1. Scroll to the top of Swagger UI
2. Click the **"Authorize"** button (🔒 icon)
3. Enter: `Bearer <your-token>`
4. Click **"Authorize"**
5. Click **"Close"**

Now all your task requests will include the token automatically!

## Error Responses

### 401 Unauthorized (No Token)
```json
{
  "status": "error",
  "message": "Authentication required. Please provide a valid Bearer token."
}
```

### 401 Unauthorized (Invalid Token)
```json
{
  "status": "error",
  "message": "Invalid or expired token"
}
```

### 404 Not Found (Wrong User)
```json
{
  "status": "error",
  "message": "Task not found or you do not have permission to access it"
}
```

### 400 Bad Request (Email Already Exists)
```json
{
  "status": "error",
  "message": "User with this email already exists"
}
```

### 401 Unauthorized (Wrong Password)
```json
{
  "status": "error",
  "message": "Invalid email or password"
}
```

## Multi-User Testing

Test that users can only see their own tasks:

### User 1
```bash
# Signup
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "firstName": "Alice",
    "lastName": "Smith",
    "password": "password123"
  }'

# Save token as USER1_TOKEN

# Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER1_TOKEN" \
  -d '{"title": "Alice task", "priority": "HIGH"}'
```

### User 2
```bash
# Signup
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob@example.com",
    "firstName": "Bob",
    "lastName": "Johnson",
    "password": "password456"
  }'

# Save token as USER2_TOKEN

# Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER2_TOKEN" \
  -d '{"title": "Bob task", "priority": "MEDIUM"}'

# Get all tasks (will only see Bob's tasks)
curl -H "Authorization: Bearer $USER2_TOKEN" \
  http://localhost:5000/api/tasks
```

## Security Features

✅ **Password Hashing** - Passwords are hashed with bcrypt (10 rounds)  
✅ **JWT Authentication** - Tokens expire after 7 days  
✅ **Authorization** - Users can only access their own tasks  
✅ **Protected Routes** - All task endpoints require authentication  
✅ **Input Validation** - Email format, password length (min 6 chars)  
✅ **Email Normalization** - Emails converted to lowercase  

## Environment Variables

Add to your `.env` file (optional):

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=5000
```

## Testing Checklist

- [ ] Signup with valid data
- [ ] Signup with duplicate email (should fail)
- [ ] Signup with invalid email format (should fail)
- [ ] Signup with short password (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Login with non-existent email (should fail)
- [ ] Create task without token (should return 401)
- [ ] Create task with token (should succeed)
- [ ] Get all tasks (should only show your tasks)
- [ ] Try to access another user's task by ID (should return 404)
- [ ] Update your own task (should succeed)
- [ ] Try to update another user's task (should return 404)
- [ ] Delete your own task (should succeed)
- [ ] Try to delete another user's task (should return 404)
- [ ] Use expired/invalid token (should return 401)

## What Changed

### New Endpoints
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Authenticate user

### Updated Endpoints (Now Protected)
- `GET /api/tasks` - Returns only your tasks
- `GET /api/tasks/:id` - Only accessible if you own the task
- `POST /api/tasks` - Task automatically assigned to you
- `PUT /api/tasks/:id` - Only updateable if you own the task
- `DELETE /api/tasks/:id` - Only deletable if you own the task

### New Task Field
- `userId` - Automatically added to each task (UUID of the creator)

### Token Format
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjNlNDU2Ny1lODliLTEyZDMtYTQ1Ni00MjY2MTQxNzQwMDAiLCJpYXQiOjE2MDk0NTkyMDAsImV4cCI6MTYxMDA2NDAwMH0.signature
```

Payload contains: `{ userId: "...", iat: ..., exp: ... }`

Happy testing! 🔐🚀
