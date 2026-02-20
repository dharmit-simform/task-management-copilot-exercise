#!/bin/bash

# Task Management API - Complete Test Script
# This script tests all API endpoints with various scenarios

# Color codes for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
BASE_URL="http://localhost:3000"
API_URL="${BASE_URL}/api"
AUTH_URL="${BASE_URL}/auth"

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Global variables to store tokens and IDs
USER1_TOKEN=""
USER2_TOKEN=""
TASK1_ID=""
TASK2_ID=""
TASK3_ID=""

# Helper function to print section headers
print_header() {
    echo ""
    echo -e "${BOLD}${CYAN}========================================${NC}"
    echo -e "${BOLD}${CYAN}$1${NC}"
    echo -e "${BOLD}${CYAN}========================================${NC}"
    echo ""
}

# Helper function to print test description
print_test() {
    echo -e "${YELLOW}TEST $((TOTAL_TESTS + 1)):${NC} $1"
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
}

# Helper function to print success
print_success() {
    echo -e "${GREEN}✓ PASSED${NC} - $1"
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo ""
}

# Helper function to print failure
print_failure() {
    echo -e "${RED}✗ FAILED${NC} - $1"
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo ""
}

# Helper function to print response
print_response() {
    echo -e "${BLUE}Response:${NC}"
    echo "$1" | jq '.' 2>/dev/null || echo "$1"
    echo ""
}

# Helper function to extract value from JSON response
extract_json_value() {
    echo "$1" | jq -r "$2" 2>/dev/null
}

# Wait for server to be ready
wait_for_server() {
    print_header "CHECKING SERVER AVAILABILITY"
    local max_attempts=30
    local attempt=0
    
    echo "Waiting for server to be ready..."
    while [ $attempt -lt $max_attempts ]; do
        if curl -s "${BASE_URL}/health" > /dev/null 2>&1; then
            echo -e "${GREEN}Server is ready!${NC}\n"
            return 0
        fi
        attempt=$((attempt + 1))
        echo -n "."
        sleep 1
    done
    
    echo -e "\n${RED}Server is not responding. Please start the server first.${NC}"
    echo "Run: cd backend && npm run dev"
    exit 1
}

# Test Health Endpoint
test_health() {
    print_header "1. HEALTH CHECK ENDPOINT"
    
    print_test "GET /health - Check server health"
    response=$(curl -s -w "\n%{http_code}" "${BASE_URL}/health")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "200" ]; then
        print_success "Server is healthy"
    else
        print_failure "Expected 200, got $http_code"
    fi
}

# Test Authentication - Signup
test_auth_signup() {
    print_header "2. AUTHENTICATION - SIGNUP"
    
    # Test successful signup for user 1
    print_test "POST /auth/signup - Create new user (User 1)"
    response=$(curl -s -w "\n%{http_code}" -X POST "${AUTH_URL}/signup" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "test.user1@example.com",
            "firstName": "Test",
            "lastName": "User1",
            "password": "SecurePass123!"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "201" ]; then
        USER1_TOKEN=$(extract_json_value "$body" ".data.token")
        print_success "User 1 created successfully. Token saved."
    else
        print_failure "Expected 201, got $http_code"
    fi
    
    # Test successful signup for user 2
    print_test "POST /auth/signup - Create second user (User 2)"
    response=$(curl -s -w "\n%{http_code}" -X POST "${AUTH_URL}/signup" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "test.user2@example.com",
            "firstName": "Test",
            "lastName": "User2",
            "password": "SecurePass456!"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "201" ]; then
        USER2_TOKEN=$(extract_json_value "$body" ".data.token")
        print_success "User 2 created successfully. Token saved."
    else
        print_failure "Expected 201, got $http_code"
    fi
    
    # Test duplicate email
    print_test "POST /auth/signup - Duplicate email (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X POST "${AUTH_URL}/signup" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "test.user1@example.com",
            "firstName": "Duplicate",
            "lastName": "User",
            "password": "AnotherPass123!"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "400" ]; then
        print_success "Duplicate email correctly rejected"
    else
        print_failure "Expected 400, got $http_code"
    fi
    
    # Test invalid email format
    print_test "POST /auth/signup - Invalid email format (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X POST "${AUTH_URL}/signup" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "invalid-email",
            "firstName": "Test",
            "lastName": "User",
            "password": "SecurePass123!"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "400" ]; then
        print_success "Invalid email format correctly rejected"
    else
        print_failure "Expected 400, got $http_code"
    fi
    
    # Test short password
    print_test "POST /auth/signup - Password too short (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X POST "${AUTH_URL}/signup" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "test.user3@example.com",
            "firstName": "Test",
            "lastName": "User",
            "password": "12345"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "400" ]; then
        print_success "Short password correctly rejected"
    else
        print_failure "Expected 400, got $http_code"
    fi
    
    # Test missing required fields
    print_test "POST /auth/signup - Missing required fields (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X POST "${AUTH_URL}/signup" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "test.user4@example.com"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "400" ]; then
        print_success "Missing fields correctly rejected"
    else
        print_failure "Expected 400, got $http_code"
    fi
}

# Test Authentication - Login
test_auth_login() {
    print_header "3. AUTHENTICATION - LOGIN"
    
    # Test successful login
    print_test "POST /auth/login - Valid credentials"
    response=$(curl -s -w "\n%{http_code}" -X POST "${AUTH_URL}/login" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "test.user1@example.com",
            "password": "SecurePass123!"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "200" ]; then
        print_success "Login successful"
    else
        print_failure "Expected 200, got $http_code"
    fi
    
    # Test wrong password
    print_test "POST /auth/login - Wrong password (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X POST "${AUTH_URL}/login" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "test.user1@example.com",
            "password": "WrongPassword123!"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "401" ]; then
        print_success "Wrong password correctly rejected"
    else
        print_failure "Expected 401, got $http_code"
    fi
    
    # Test non-existent user
    print_test "POST /auth/login - Non-existent user (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X POST "${AUTH_URL}/login" \
        -H "Content-Type: application/json" \
        -d '{
            "email": "nonexistent@example.com",
            "password": "SomePassword123!"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "401" ]; then
        print_success "Non-existent user correctly rejected"
    else
        print_failure "Expected 401, got $http_code"
    fi
}

# Test Task Creation
test_task_creation() {
    print_header "4. TASK CREATION"
    
    # Test creating task without authentication
    print_test "POST /api/tasks - Without authentication (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/tasks" \
        -H "Content-Type: application/json" \
        -d '{
            "title": "Unauthorized task"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "401" ]; then
        print_success "Unauthorized request correctly rejected"
    else
        print_failure "Expected 401, got $http_code"
    fi
    
    # Create task with minimal data
    print_test "POST /api/tasks - Minimal task (title only)"
    response=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/tasks" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER1_TOKEN}" \
        -d '{
            "title": "Simple task"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "201" ]; then
        TASK1_ID=$(extract_json_value "$body" ".data.id")
        print_success "Task created with defaults. ID: $TASK1_ID"
    else
        print_failure "Expected 201, got $http_code"
    fi
    
    # Create complete task
    print_test "POST /api/tasks - Complete task with all fields"
    response=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/tasks" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER1_TOKEN}" \
        -d '{
            "title": "Implement user authentication",
            "description": "Add JWT-based authentication with login and signup",
            "status": "IN_PROGRESS",
            "priority": "HIGH"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "201" ]; then
        TASK2_ID=$(extract_json_value "$body" ".data.id")
        print_success "Complete task created. ID: $TASK2_ID"
    else
        print_failure "Expected 201, got $http_code"
    fi
    
    # Create task with due date
    print_test "POST /api/tasks - Task with valid due date"
    response=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/tasks" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER1_TOKEN}" \
        -d '{
            "title": "Complete project documentation",
            "description": "Write comprehensive API documentation",
            "status": "TODO",
            "priority": "MEDIUM",
            "dueDate": "2026-03-15"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "201" ]; then
        TASK3_ID=$(extract_json_value "$body" ".data.id")
        print_success "Task with due date created. ID: $TASK3_ID"
    else
        print_failure "Expected 201, got $http_code"
    fi
    
    # Test past due date
    print_test "POST /api/tasks - Task with past due date (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/tasks" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER1_TOKEN}" \
        -d '{
            "title": "Task with past date",
            "dueDate": "2020-01-01"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "400" ]; then
        print_success "Past due date correctly rejected"
    else
        print_failure "Expected 400, got $http_code"
    fi
    
    # Test invalid due date format
    print_test "POST /api/tasks - Task with invalid date format (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/tasks" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER1_TOKEN}" \
        -d '{
            "title": "Task with invalid date",
            "dueDate": "15-03-2026"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "400" ]; then
        print_success "Invalid date format correctly rejected"
    else
        print_failure "Expected 400, got $http_code"
    fi
    
    # Test empty title
    print_test "POST /api/tasks - Empty title (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/tasks" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER1_TOKEN}" \
        -d '{
            "title": ""
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "400" ]; then
        print_success "Empty title correctly rejected"
    else
        print_failure "Expected 400, got $http_code"
    fi
    
    # Test invalid status
    print_test "POST /api/tasks - Invalid status (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/tasks" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER1_TOKEN}" \
        -d '{
            "title": "Task with invalid status",
            "status": "INVALID_STATUS"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "400" ]; then
        print_success "Invalid status correctly rejected"
    else
        print_failure "Expected 400, got $http_code"
    fi
    
    # Test invalid priority
    print_test "POST /api/tasks - Invalid priority (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/tasks" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER1_TOKEN}" \
        -d '{
            "title": "Task with invalid priority",
            "priority": "URGENT"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "400" ]; then
        print_success "Invalid priority correctly rejected"
    else
        print_failure "Expected 400, got $http_code"
    fi
    
    # Create tasks for User 2
    print_test "POST /api/tasks - Create task for User 2"
    response=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/tasks" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER2_TOKEN}" \
        -d '{
            "title": "User 2 task",
            "description": "This belongs to User 2",
            "status": "TODO",
            "priority": "LOW"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "201" ]; then
        print_success "Task created for User 2"
    else
        print_failure "Expected 201, got $http_code"
    fi
}

# Test Get All Tasks
test_get_all_tasks() {
    print_header "5. GET ALL TASKS"
    
    # Get all tasks for User 1
    print_test "GET /api/tasks - Get all tasks for authenticated user"
    response=$(curl -s -w "\n%{http_code}" -X GET "${API_URL}/tasks" \
        -H "Authorization: Bearer ${USER1_TOKEN}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "200" ]; then
        print_success "Retrieved tasks successfully"
    else
        print_failure "Expected 200, got $http_code"
    fi
    
    # Test pagination
    print_test "GET /api/tasks?page=1&limit=2 - Pagination"
    response=$(curl -s -w "\n%{http_code}" -X GET "${API_URL}/tasks?page=1&limit=2" \
        -H "Authorization: Bearer ${USER1_TOKEN}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "200" ]; then
        print_success "Pagination works correctly"
    else
        print_failure "Expected 200, got $http_code"
    fi
    
    # Filter by status
    print_test "GET /api/tasks?status=TODO - Filter by status"
    response=$(curl -s -w "\n%{http_code}" -X GET "${API_URL}/tasks?status=TODO" \
        -H "Authorization: Bearer ${USER1_TOKEN}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "200" ]; then
        print_success "Status filter works"
    else
        print_failure "Expected 200, got $http_code"
    fi
    
    # Filter by multiple statuses
    print_test "GET /api/tasks?status=TODO,IN_PROGRESS - Filter by multiple statuses"
    response=$(curl -s -w "\n%{http_code}" -X GET "${API_URL}/tasks?status=TODO,IN_PROGRESS" \
        -H "Authorization: Bearer ${USER1_TOKEN}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "200" ]; then
        print_success "Multiple status filter works"
    else
        print_failure "Expected 200, got $http_code"
    fi
    
    # Filter by priority
    print_test "GET /api/tasks?priority=HIGH - Filter by priority"
    response=$(curl -s -w "\n%{http_code}" -X GET "${API_URL}/tasks?priority=HIGH" \
        -H "Authorization: Bearer ${USER1_TOKEN}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "200" ]; then
        print_success "Priority filter works"
    else
        print_failure "Expected 200, got $http_code"
    fi
    
    # Search
    print_test "GET /api/tasks?search=authentication - Search tasks"
    response=$(curl -s -w "\n%{http_code}" -X GET "${API_URL}/tasks?search=authentication" \
        -H "Authorization: Bearer ${USER1_TOKEN}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "200" ]; then
        print_success "Search works"
    else
        print_failure "Expected 200, got $http_code"
    fi
    
    # Combined filters
    print_test "GET /api/tasks?status=TODO&priority=MEDIUM&search=documentation - Combined filters"
    response=$(curl -s -w "\n%{http_code}" -X GET "${API_URL}/tasks?status=TODO&priority=MEDIUM&search=documentation" \
        -H "Authorization: Bearer ${USER1_TOKEN}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "200" ]; then
        print_success "Combined filters work"
    else
        print_failure "Expected 200, got $http_code"
    fi
}

# Test Get Task by ID
test_get_task_by_id() {
    print_header "6. GET TASK BY ID"
    
    # Get existing task
    print_test "GET /api/tasks/:id - Get task by valid ID"
    response=$(curl -s -w "\n%{http_code}" -X GET "${API_URL}/tasks/${TASK1_ID}" \
        -H "Authorization: Bearer ${USER1_TOKEN}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "200" ]; then
        print_success "Task retrieved successfully"
    else
        print_failure "Expected 200, got $http_code"
    fi
    
    # Get non-existent task
    print_test "GET /api/tasks/:id - Non-existent task ID (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X GET "${API_URL}/tasks/00000000-0000-0000-0000-000000000000" \
        -H "Authorization: Bearer ${USER1_TOKEN}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "404" ]; then
        print_success "Non-existent task correctly returned 404"
    else
        print_failure "Expected 404, got $http_code"
    fi
    
    # Get invalid UUID format
    print_test "GET /api/tasks/:id - Invalid UUID format (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X GET "${API_URL}/tasks/invalid-uuid" \
        -H "Authorization: Bearer ${USER1_TOKEN}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "400" ]; then
        print_success "Invalid UUID format correctly rejected"
    else
        print_failure "Expected 400, got $http_code"
    fi
}

# Test Update Task
test_update_task() {
    print_header "7. UPDATE TASK"
    
    # Update task title
    print_test "PUT /api/tasks/:id - Update task title"
    response=$(curl -s -w "\n%{http_code}" -X PUT "${API_URL}/tasks/${TASK1_ID}" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER1_TOKEN}" \
        -d '{
            "title": "Updated simple task"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "200" ]; then
        print_success "Task title updated successfully"
    else
        print_failure "Expected 200, got $http_code"
    fi
    
    # Update multiple fields
    print_test "PUT /api/tasks/:id - Update multiple fields"
    response=$(curl -s -w "\n%{http_code}" -X PUT "${API_URL}/tasks/${TASK2_ID}" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER1_TOKEN}" \
        -d '{
            "status": "DONE",
            "priority": "LOW",
            "description": "Authentication implemented successfully"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "200" ]; then
        print_success "Multiple fields updated successfully"
    else
        print_failure "Expected 200, got $http_code"
    fi
    
    # Update due date
    print_test "PUT /api/tasks/:id - Update due date"
    response=$(curl -s -w "\n%{http_code}" -X PUT "${API_URL}/tasks/${TASK3_ID}" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER1_TOKEN}" \
        -d '{
            "dueDate": "2026-04-30"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "200" ]; then
        print_success "Due date updated successfully"
    else
        print_failure "Expected 200, got $http_code"
    fi
    
    # Update with past due date
    print_test "PUT /api/tasks/:id - Update with past due date (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X PUT "${API_URL}/tasks/${TASK3_ID}" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER1_TOKEN}" \
        -d '{
            "dueDate": "2020-01-01"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "400" ]; then
        print_success "Past due date correctly rejected"
    else
        print_failure "Expected 400, got $http_code"
    fi
    
    # Update non-existent task
    print_test "PUT /api/tasks/:id - Update non-existent task (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X PUT "${API_URL}/tasks/00000000-0000-0000-0000-000000000000" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER1_TOKEN}" \
        -d '{
            "title": "This should fail"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "404" ]; then
        print_success "Non-existent task update correctly rejected"
    else
        print_failure "Expected 404, got $http_code"
    fi
    
    # Update with empty body
    print_test "PUT /api/tasks/:id - Update with no fields (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X PUT "${API_URL}/tasks/${TASK1_ID}" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER1_TOKEN}" \
        -d '{}')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "400" ]; then
        print_success "Empty update correctly rejected"
    else
        print_failure "Expected 400, got $http_code"
    fi
    
    # Update with invalid status
    print_test "PUT /api/tasks/:id - Update with invalid status (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X PUT "${API_URL}/tasks/${TASK1_ID}" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER1_TOKEN}" \
        -d '{
            "status": "INVALID"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "400" ]; then
        print_success "Invalid status correctly rejected"
    else
        print_failure "Expected 400, got $http_code"
    fi
}

# Test Authorization
test_authorization() {
    print_header "8. AUTHORIZATION (Cross-User Access)"
    
    # Try to access User 1's task with User 2's token
    print_test "GET /api/tasks/:id - Access another user's task (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X GET "${API_URL}/tasks/${TASK1_ID}" \
        -H "Authorization: Bearer ${USER2_TOKEN}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "404" ]; then
        print_success "Cross-user access correctly denied"
    else
        print_failure "Expected 404, got $http_code"
    fi
    
    # Try to update another user's task
    print_test "PUT /api/tasks/:id - Update another user's task (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X PUT "${API_URL}/tasks/${TASK1_ID}" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ${USER2_TOKEN}" \
        -d '{
            "title": "Attempting to update another users task"
        }')
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "404" ]; then
        print_success "Cross-user update correctly denied"
    else
        print_failure "Expected 404, got $http_code"
    fi
    
    # Try to delete another user's task
    print_test "DELETE /api/tasks/:id - Delete another user's task (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X DELETE "${API_URL}/tasks/${TASK1_ID}" \
        -H "Authorization: Bearer ${USER2_TOKEN}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "404" ]; then
        print_success "Cross-user delete correctly denied"
    else
        print_failure "Expected 404, got $http_code"
    fi
}

# Test Delete Task
test_delete_task() {
    print_header "9. DELETE TASK"
    
    # Delete existing task
    print_test "DELETE /api/tasks/:id - Delete valid task"
    response=$(curl -s -w "\n%{http_code}" -X DELETE "${API_URL}/tasks/${TASK1_ID}" \
        -H "Authorization: Bearer ${USER1_TOKEN}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "204" ]; then
        print_success "Task deleted successfully"
    else
        print_failure "Expected 204, got $http_code"
    fi
    
    # Try to delete the same task again
    print_test "DELETE /api/tasks/:id - Delete already deleted task (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X DELETE "${API_URL}/tasks/${TASK1_ID}" \
        -H "Authorization: Bearer ${USER1_TOKEN}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "404" ]; then
        print_success "Already deleted task correctly returned 404"
    else
        print_failure "Expected 404, got $http_code"
    fi
    
    # Delete non-existent task
    print_test "DELETE /api/tasks/:id - Delete non-existent task (should fail)"
    response=$(curl -s -w "\n%{http_code}" -X DELETE "${API_URL}/tasks/00000000-0000-0000-0000-000000000000" \
        -H "Authorization: Bearer ${USER1_TOKEN}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    print_response "$body"
    
    if [ "$http_code" = "404" ]; then
        print_success "Non-existent task delete correctly returned 404"
    else
        print_failure "Expected 404, got $http_code"
    fi
}

# Print summary
print_summary() {
    print_header "TEST SUMMARY"
    
    echo -e "${BOLD}Total Tests:${NC} $TOTAL_TESTS"
    echo -e "${GREEN}${BOLD}Passed:${NC} $PASSED_TESTS"
    echo -e "${RED}${BOLD}Failed:${NC} $FAILED_TESTS"
    echo ""
    
    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}${BOLD}🎉 All tests passed!${NC}"
    else
        echo -e "${RED}${BOLD}⚠️  Some tests failed. Please review the output above.${NC}"
    fi
    echo ""
}

# Main execution
main() {
    clear
    echo -e "${BOLD}${BLUE}"
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║     TASK MANAGEMENT API - COMPREHENSIVE TEST SUITE      ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    # Check if jq is installed
    if ! command -v jq &> /dev/null; then
        echo -e "${YELLOW}Warning: 'jq' is not installed. JSON responses will not be formatted.${NC}"
        echo -e "${YELLOW}Install jq for better output: brew install jq${NC}"
        echo ""
    fi
    
    wait_for_server
    
    test_health
    test_auth_signup
    test_auth_login
    test_task_creation
    test_get_all_tasks
    test_get_task_by_id
    test_update_task
    test_authorization
    test_delete_task
    
    print_summary
}

# Run the test suite
main
