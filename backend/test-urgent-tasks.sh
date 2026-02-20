#!/bin/bash

# Test script for urgent task sorting functionality
# Tests that HIGH priority tasks with due dates within 7 days appear at the top

BASE_URL="http://localhost:3000"
EMAIL="test_urgent_$(date +%s)@example.com"
PASSWORD="Test@123456"

echo "============================================"
echo "Testing Urgent Task Sorting Feature"
echo "============================================"
echo ""

# Step 1: Register a new user
echo "1. Registering test user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"name\":\"Test User\"}")

echo "$REGISTER_RESPONSE" | jq '.'
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "Error: Failed to register user"
  exit 1
fi

echo "✓ User registered successfully"
echo "Token: $TOKEN"
echo ""

# Calculate dates
TODAY=$(date +%Y-%m-%d)
TOMORROW=$(date -v+1d +%Y-%m-%d 2>/dev/null || date -d "+1 day" +%Y-%m-%d)
THREE_DAYS=$(date -v+3d +%Y-%m-%d 2>/dev/null || date -d "+3 days" +%Y-%m-%d)
FIVE_DAYS=$(date -v+5d +%Y-%m-%d 2>/dev/null || date -d "+5 days" +%Y-%m-%d)
TEN_DAYS=$(date -v+10d +%Y-%m-%d 2>/dev/null || date -d "+10 days" +%Y-%m-%d)

echo "2. Creating test tasks..."
echo "   Date references:"
echo "   - Today: $TODAY"
echo "   - Tomorrow: $TOMORROW"
echo "   - 3 days: $THREE_DAYS"
echo "   - 5 days: $FIVE_DAYS"
echo "   - 10 days: $TEN_DAYS"
echo ""

# Task 1: URGENT - HIGH priority, due in 3 days (should be at top)
echo "   Creating Task 1: HIGH priority, due in 3 days (URGENT)..."
curl -s -X POST "$BASE_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"URGENT: Fix production bug\",\"description\":\"Critical bug needs immediate attention\",\"priority\":\"HIGH\",\"dueDate\":\"$THREE_DAYS\",\"status\":\"TODO\"}" \
  | jq -r '.data.id + " - " + .data.title'

# Task 2: URGENT - HIGH priority, due tomorrow (should be at top, before Task 1)
echo "   Creating Task 2: HIGH priority, due tomorrow (URGENT)..."
curl -s -X POST "$BASE_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"URGENT: Deploy hotfix\",\"description\":\"Deploy critical hotfix\",\"priority\":\"HIGH\",\"dueDate\":\"$TOMORROW\",\"status\":\"TODO\"}" \
  | jq -r '.data.id + " - " + .data.title'

# Task 3: NOT URGENT - MEDIUM priority, due in 2 days (should be after urgent tasks)
echo "   Creating Task 3: MEDIUM priority, due in 2 days (NOT URGENT)..."
curl -s -X POST "$BASE_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"Update documentation\",\"description\":\"Regular task\",\"priority\":\"MEDIUM\",\"dueDate\":\"$THREE_DAYS\",\"status\":\"TODO\"}" \
  | jq -r '.data.id + " - " + .data.title'

# Task 4: NOT URGENT - HIGH priority, due in 10 days (beyond 7 days, should be after urgent)
echo "   Creating Task 4: HIGH priority, due in 10 days (NOT URGENT)..."
curl -s -X POST "$BASE_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"Plan Q2 roadmap\",\"description\":\"Long-term planning\",\"priority\":\"HIGH\",\"dueDate\":\"$TEN_DAYS\",\"status\":\"TODO\"}" \
  | jq -r '.data.id + " - " + .data.title'

# Task 5: NOT URGENT - HIGH priority, no due date (should be after urgent)
echo "   Creating Task 5: HIGH priority, no due date (NOT URGENT)..."
curl -s -X POST "$BASE_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"Research new technologies\",\"description\":\"Backlog item\",\"priority\":\"HIGH\",\"status\":\"TODO\"}" \
  | jq -r '.data.id + " - " + .data.title'

# Task 6: URGENT - HIGH priority, due in 5 days (should be at top, after Task 2, Task 1)
echo "   Creating Task 6: HIGH priority, due in 5 days (URGENT)..."
curl -s -X POST "$BASE_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"URGENT: Review security patches\",\"description\":\"Security review needed\",\"priority\":\"HIGH\",\"dueDate\":\"$FIVE_DAYS\",\"status\":\"TODO\"}" \
  | jq -r '.data.id + " - " + .data.title'

echo "✓ All 6 tasks created successfully"
echo ""

# Step 3: Fetch all tasks and verify sorting
echo "3. Fetching all tasks to verify urgent task sorting..."
echo ""
TASKS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/tasks" \
  -H "Authorization: Bearer $TOKEN")

echo "Tasks Response:"
echo "$TASKS_RESPONSE" | jq '.'
echo ""

echo "============================================"
echo "Expected Order (Urgent tasks first):"
echo "============================================"
echo "Position 1: Deploy hotfix (HIGH, due tomorrow - $TOMORROW)"
echo "Position 2: Fix production bug (HIGH, due in 3 days - $THREE_DAYS)"
echo "Position 3: Review security patches (HIGH, due in 5 days - $FIVE_DAYS)"
echo "Position 4-6: Other tasks (MEDIUM/2days, HIGH/10days, HIGH/no-date)"
echo ""

echo "============================================"
echo "Actual Order from API:"
echo "============================================"
echo "$TASKS_RESPONSE" | jq -r '.data[] | "\(.title) - Priority: \(.priority), Due: \(.dueDate // "N/A")"' | nl
echo ""

# Verify the top 3 are urgent tasks
FIRST_TASK=$(echo "$TASKS_RESPONSE" | jq -r '.data[0].title')
SECOND_TASK=$(echo "$TASKS_RESPONSE" | jq -r '.data[1].title')
THIRD_TASK=$(echo "$TASKS_RESPONSE" | jq -r '.data[2].title')

echo "============================================"
echo "Verification Results:"
echo "============================================"

if [[ $FIRST_TASK == *"URGENT"* ]]; then
  echo "✓ Position 1: Urgent task detected"
else
  echo "✗ Position 1: Expected urgent task, got: $FIRST_TASK"
fi

if [[ $SECOND_TASK == *"URGENT"* ]]; then
  echo "✓ Position 2: Urgent task detected"
else
  echo "✗ Position 2: Expected urgent task, got: $SECOND_TASK"
fi

if [[ $THIRD_TASK == *"URGENT"* ]]; then
  echo "✓ Position 3: Urgent task detected"
else
  echo "✗ Position 3: Expected urgent task, got: $THIRD_TASK"
fi

echo ""
echo "============================================"
echo "Test completed!"
echo "============================================"
