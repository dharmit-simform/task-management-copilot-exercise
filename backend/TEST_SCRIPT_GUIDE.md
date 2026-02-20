# API Test Script Guide

## Overview

The `test-api.sh` script is a comprehensive test suite that validates all API endpoints and scenarios in the Task Management API.

## Prerequisites

1. **Server must be running**
   ```bash
   cd backend
   npm run dev
   ```

2. **Optional: Install jq for formatted JSON output**
   ```bash
   # macOS
   brew install jq
   
   # Ubuntu/Debian
   sudo apt-get install jq
   ```

## Running the Tests

```bash
# From the backend directory
./test-api.sh
```

## What the Script Tests

### 1. Health Check
- ✓ Server availability check

### 2. Authentication - Signup
- ✓ Create new user (User 1)
- ✓ Create second user (User 2)
- ✓ Reject duplicate email
- ✓ Reject invalid email format
- ✓ Reject password too short
- ✓ Reject missing required fields

### 3. Authentication - Login
- ✓ Valid credentials
- ✓ Reject wrong password
- ✓ Reject non-existent user

### 4. Task Creation
- ✓ Reject unauthorized requests
- ✓ Create minimal task (title only)
- ✓ Create complete task with all fields
- ✓ Create task with valid due date
- ✓ Reject past due date
- ✓ Reject invalid date format (must be YYYY-MM-DD)
- ✓ Reject empty title
- ✓ Reject invalid status
- ✓ Reject invalid priority
- ✓ Create task for User 2

### 5. Get All Tasks
- ✓ Get all tasks for authenticated user
- ✓ Pagination (page & limit)
- ✓ Filter by status
- ✓ Filter by multiple statuses
- ✓ Filter by priority
- ✓ Search in title and description
- ✓ Combined filters

### 6. Get Task by ID
- ✓ Get task by valid ID
- ✓ Return 404 for non-existent task
- ✓ Reject invalid UUID format

### 7. Update Task
- ✓ Update task title
- ✓ Update multiple fields
- ✓ Update due date
- ✓ Reject past due date in update
- ✓ Return 404 for non-existent task
- ✓ Reject empty update
- ✓ Reject invalid status

### 8. Authorization (Cross-User Access)
- ✓ Deny access to another user's task
- ✓ Deny update of another user's task
- ✓ Deny delete of another user's task

### 9. Delete Task
- ✓ Delete valid task
- ✓ Return 404 when deleting already deleted task
- ✓ Return 404 for non-existent task

## Understanding the Output

The script uses color-coded output:
- 🟢 **GREEN** - Test passed
- 🔴 **RED** - Test failed
- 🟡 **YELLOW** - Test description
- 🔵 **BLUE** - Response data
- 🔷 **CYAN** - Section headers

### Sample Output

```
========================================
1. HEALTH CHECK ENDPOINT
========================================

TEST 1: GET /health - Check server health
Response:
{
  "status": "ok",
  "timestamp": "2026-02-20T10:30:00.000Z"
}

✓ PASSED - Server is healthy
```

## Test Summary

At the end of the test run, you'll see a summary:

```
========================================
TEST SUMMARY
========================================

Total Tests: 45
Passed: 45
Failed: 0

🎉 All tests passed!
```

## Troubleshooting

### Server Not Running
```
Server is not responding. Please start the server first.
Run: cd backend && npm run dev
```
**Solution:** Start the backend server before running tests.

### Port Already in Use
If port 5000 is already in use, update the `BASE_URL` variable in the script:
```bash
BASE_URL="http://localhost:YOUR_PORT"
```

### jq Not Found
The script works without `jq`, but JSON responses won't be formatted. Install it for better readability:
```bash
brew install jq
```

### Test Failures
- Check that the server is running correctly
- Verify that all recent code changes are included
- Check the response body for error messages
- Ensure the database/in-memory store is in a clean state

## Customizing Tests

You can modify the script to:
- Add more test cases
- Change test data
- Adjust expected HTTP status codes
- Add custom validation logic

## Notes

- The script automatically creates two test users for cross-user testing
- All created tasks are stored in the in-memory database
- Tests are executed sequentially to maintain dependencies
- Failed tests don't stop execution - all tests run to completion

## Manual Testing

If you prefer manual testing, refer to:
- [AUTH_TESTING_GUIDE.md](AUTH_TESTING_GUIDE.md) - Authentication endpoints
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Task management endpoints
- http://localhost:5000/api-docs - Interactive Swagger documentation
