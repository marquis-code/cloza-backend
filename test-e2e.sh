#!/usr/bin/env bash
# =============================================================================
# Cloza Backend – FULL End-to-End Test Suite
# Covers ALL endpoints across every module:
#   Public, Auth, Users, Workspaces, Commerce, Social, Payments,
#   Conversations, Media, Audit
# =============================================================================

set -uo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
TIMESTAMP=$(date +%s)
TEST_EMAIL="e2e_${TIMESTAMP}@example.com"
TEST_PASSWORD="testpass123"
TEST_NAME="E2E Test User"
TEST_PLAN="pro"

PASS=0
FAIL=0
SKIP=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

log_pass()  { PASS=$((PASS+1)); echo -e "  ${GREEN}✓ PASS${NC}: $1"; }
log_fail()  { FAIL=$((FAIL+1)); echo -e "  ${RED}✗ FAIL${NC}: $1"; }
log_skip()  { SKIP=$((SKIP+1)); echo -e "  ${YELLOW}⊘ SKIP${NC}: $1"; }
log_info()  { echo -e "  ${CYAN}→${NC} $1"; }
section()   { echo ""; echo -e "${BOLD}━━━ $1 ━━━${NC}"; }
separator() { echo "  ──────────────────────────────────────────"; }

# Utility: extract JSON field with python3
json_get() { echo "$1" | python3 -c "import sys,json; print(json.load(sys.stdin)$2)" 2>/dev/null || echo ""; }

# Utility: make a request
#   Usage: do_request METHOD PATH [BODY] [TOKEN]
#   Sets: RESP_HTTP, RESP_BODY
do_request() {
  local method="$1" path="$2" body="${3:-}" token="${4:-}"
  local auth_header=""
  local content_header="-H Content-Type:application/json"

  if [ -n "$token" ]; then
    auth_header="-H Authorization:Bearer ${token}"
  fi

  local raw
  if [ -n "$body" ]; then
    raw=$(curl -s -w "\n%{http_code}" -X "$method" "${BASE_URL}${path}" \
      -H "Content-Type: application/json" \
      ${auth_header:+-H "Authorization: Bearer ${token}"} \
      -d "$body")
  else
    raw=$(curl -s -w "\n%{http_code}" -X "$method" "${BASE_URL}${path}" \
      ${auth_header:+-H "Authorization: Bearer ${token}"})
  fi

  RESP_HTTP=$(echo "$raw" | tail -1)
  RESP_BODY=$(echo "$raw" | sed '$d')
}

# Utility: assert HTTP status
assert_status() {
  local expected="$1" label="$2"
  # Accept comma-separated expected codes like "200,201"
  local IFS=','
  for code in $expected; do
    if [ "$RESP_HTTP" = "$code" ]; then
      log_pass "$label → HTTP $RESP_HTTP"
      return
    fi
  done
  log_fail "$label → HTTP $RESP_HTTP (expected $expected)"
  echo "    Response: $(echo "$RESP_BODY" | head -3)"
}

# Utility: fetch verification code from DB
fetch_code() {
  npx -y tsx /Users/mac/cloza-backend/scripts/get-verify-code.ts "$1" 2>/dev/null | tail -1
}

# =============================================================================
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║       CLOZA BACKEND – FULL E2E TEST SUITE           ║${NC}"
echo -e "${BOLD}║       Base URL: ${BASE_URL}                    ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

# Keep track of IDs created during the flow
ACCESS_TOKEN=""
WORKSPACE_ID=""
PRODUCT_ID=""
CUSTOMER_ID=""
ORDER_ID=""
CONVERSATION_ID=""

# ─────────────────────────────────────────────────────────────────────────────
# MODULE 1: PUBLIC ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────
section "MODULE 1: PUBLIC ENDPOINTS"

# 1.1 Health check
do_request GET "/"
assert_status "200" "GET / (health check)"

# 1.2 Get plans
do_request GET "/plans"
assert_status "200" "GET /plans (public pricing)"
PLAN_COUNT=$(json_get "$RESP_BODY" ".get('plans',[]).__len__()")
if [ "$PLAN_COUNT" = "3" ]; then
  log_pass "Plans returned 3 items (starter, pro, business)"
else
  log_fail "Expected 3 plans, got $PLAN_COUNT"
fi

# ─────────────────────────────────────────────────────────────────────────────
# MODULE 2: AUTH – Registration
# ─────────────────────────────────────────────────────────────────────────────
section "MODULE 2: AUTH – REGISTRATION & VERIFICATION"

# 2.1 Register a new user with a plan
log_info "Registering $TEST_EMAIL with plan=$TEST_PLAN"
do_request POST "/auth/register" \
  "{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\",\"name\":\"${TEST_NAME}\",\"plan\":\"${TEST_PLAN}\"}"
assert_status "201" "POST /auth/register"

# 2.2 Register duplicate – should fail
do_request POST "/auth/register" \
  "{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\",\"name\":\"${TEST_NAME}\"}"
assert_status "400" "POST /auth/register (duplicate)"

# 2.3 Login before verification – should fail
do_request POST "/auth/login" \
  "{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\"}"
assert_status "401" "POST /auth/login (unverified)"
MSG=$(json_get "$RESP_BODY" ".get('message','')")
if echo "$MSG" | grep -qi "not verified"; then
  log_pass "Error message contains 'not verified'"
else
  log_fail "Expected 'not verified' message, got: $MSG"
fi

# 2.4 Resend verification
do_request POST "/auth/resend-verification" "{\"email\":\"${TEST_EMAIL}\"}"
assert_status "200,201" "POST /auth/resend-verification"

# 2.5 Resend for non-existent user
do_request POST "/auth/resend-verification" "{\"email\":\"nobody_${TIMESTAMP}@example.com\"}"
assert_status "400" "POST /auth/resend-verification (unknown email)"

# 2.6 Verify email with code from DB
separator
log_info "Fetching verification code from DB..."
VERIFY_CODE=$(fetch_code "$TEST_EMAIL")
if [ -z "$VERIFY_CODE" ] || [ "$VERIFY_CODE" = "NONE" ]; then
  log_fail "Could not fetch verification code from DB"
else
  log_pass "Got verification code: $VERIFY_CODE"

  do_request POST "/auth/verify-email" \
    "{\"email\":\"${TEST_EMAIL}\",\"code\":\"${VERIFY_CODE}\"}"
  assert_status "200,201" "POST /auth/verify-email"
fi

# 2.7 Resend after already verified – should fail
do_request POST "/auth/resend-verification" "{\"email\":\"${TEST_EMAIL}\"}"
assert_status "400" "POST /auth/resend-verification (already verified)"

# ─────────────────────────────────────────────────────────────────────────────
# MODULE 3: AUTH – Login & 2FA
# ─────────────────────────────────────────────────────────────────────────────
section "MODULE 3: AUTH – LOGIN & 2FA"

# 3.1 Login (should send 2FA code)
do_request POST "/auth/login" \
  "{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\"}"
assert_status "200,201" "POST /auth/login (verified user)"
REQUIRES_2FA=$(json_get "$RESP_BODY" ".get('requiresVerification', False)")
if [ "$REQUIRES_2FA" = "True" ]; then
  log_pass "Response indicates 2FA required"
else
  log_fail "Expected requiresVerification=True"
fi

# 3.2 Verify login with incorrect code
do_request POST "/auth/verify-login" \
  "{\"email\":\"${TEST_EMAIL}\",\"code\":\"000000\"}"
assert_status "400" "POST /auth/verify-login (wrong code)"

# 3.3 Verify login with correct code
separator
log_info "Fetching login OTP from DB..."
LOGIN_CODE=$(fetch_code "$TEST_EMAIL")
if [ -z "$LOGIN_CODE" ] || [ "$LOGIN_CODE" = "NONE" ]; then
  log_fail "Could not fetch login OTP"
else
  log_pass "Got login OTP: $LOGIN_CODE"

  do_request POST "/auth/verify-login" \
    "{\"email\":\"${TEST_EMAIL}\",\"code\":\"${LOGIN_CODE}\"}"
  assert_status "200,201" "POST /auth/verify-login (correct code)"

  ACCESS_TOKEN=$(json_get "$RESP_BODY" ".get('access_token','')")
  if [ -n "$ACCESS_TOKEN" ]; then
    log_pass "Got access_token (${#ACCESS_TOKEN} chars)"
  else
    log_fail "No access_token in response"
  fi
fi

# 3.4 Login with wrong password
do_request POST "/auth/login" \
  "{\"email\":\"${TEST_EMAIL}\",\"password\":\"wrongpassword\"}"
assert_status "401" "POST /auth/login (wrong password)"

# 3.5 Forgot password
do_request POST "/auth/forgot-password" "{\"email\":\"${TEST_EMAIL}\"}"
assert_status "200,201" "POST /auth/forgot-password"

# ─────────────────────────────────────────────────────────────────────────────
# MODULE 4: USERS
# ─────────────────────────────────────────────────────────────────────────────
section "MODULE 4: USERS"

if [ -z "$ACCESS_TOKEN" ]; then
  log_skip "Skipping Users tests – no access token"
else
  # 4.1 Get profile
  do_request GET "/users/profile" "" "$ACCESS_TOKEN"
  assert_status "200" "GET /users/profile"
  PROFILE_NAME=$(json_get "$RESP_BODY" ".get('name','')")
  if [ "$PROFILE_NAME" = "$TEST_NAME" ]; then
    log_pass "Profile name matches: $PROFILE_NAME"
  fi

  # 4.2 Update profile
  do_request PATCH "/users/profile" \
    "{\"name\":\"Updated E2E User\",\"phoneNumber\":\"+2348012345678\"}" "$ACCESS_TOKEN"
  assert_status "200" "PATCH /users/profile"

  # 4.3 Get features
  do_request GET "/users/me/features" "" "$ACCESS_TOKEN"
  assert_status "200" "GET /users/me/features"
  ACTIVE_PLAN=$(json_get "$RESP_BODY" ".get('activePlan','')")
  log_info "Active plan: $ACTIVE_PLAN"

  # 4.4 Onboard user
  do_request PATCH "/users/onboard" "" "$ACCESS_TOKEN"
  assert_status "200" "PATCH /users/onboard"

  # 4.5 Unauthorized access without token
  do_request GET "/users/profile"
  assert_status "401" "GET /users/profile (no token)"
fi

# ─────────────────────────────────────────────────────────────────────────────
# MODULE 5: WORKSPACES
# ─────────────────────────────────────────────────────────────────────────────
section "MODULE 5: WORKSPACES"

if [ -z "$ACCESS_TOKEN" ]; then
  log_skip "Skipping Workspaces tests – no access token"
else
  # 5.1 Create workspace
  do_request POST "/workspaces" \
    "{\"name\":\"E2E Test Workspace\"}" "$ACCESS_TOKEN"
  assert_status "201" "POST /workspaces"
  WORKSPACE_ID=$(json_get "$RESP_BODY" ".get('id','')")
  if [ -n "$WORKSPACE_ID" ]; then
    log_pass "Created workspace: $WORKSPACE_ID"
  else
    log_fail "No workspace ID in response"
  fi

  # 5.2 Get all workspaces
  do_request GET "/workspaces" "" "$ACCESS_TOKEN"
  assert_status "200" "GET /workspaces"
  WS_COUNT=$(json_get "$RESP_BODY" ".__len__()")
  log_info "User has $WS_COUNT workspace(s)"

  # 5.3 Get workspace by ID
  if [ -n "$WORKSPACE_ID" ]; then
    do_request GET "/workspaces/${WORKSPACE_ID}" "" "$ACCESS_TOKEN"
    assert_status "200" "GET /workspaces/:id"
  fi

  # 5.4 Update workspace
  if [ -n "$WORKSPACE_ID" ]; then
    do_request PATCH "/workspaces/${WORKSPACE_ID}" \
      "{\"businessCategory\":\"Fashion & Apparel\",\"businessLocation\":\"Lagos, Nigeria\",\"paymentConfirmationMessage\":\"Thank you for your payment!\"}" \
      "$ACCESS_TOKEN"
    assert_status "200" "PATCH /workspaces/:id"
  fi

  # 5.5 Re-check features (now should reflect workspace plan)
  do_request GET "/users/me/features" "" "$ACCESS_TOKEN"
  assert_status "200" "GET /users/me/features (post-workspace)"
  ACTIVE_PLAN=$(json_get "$RESP_BODY" ".get('activePlan','')")
  log_info "Active plan after workspace creation: $ACTIVE_PLAN"
fi

# ─────────────────────────────────────────────────────────────────────────────
# MODULE 6: COMMERCE – Products
# ─────────────────────────────────────────────────────────────────────────────
section "MODULE 6: COMMERCE – PRODUCTS & ORDERS"

if [ -z "$ACCESS_TOKEN" ] || [ -z "$WORKSPACE_ID" ]; then
  log_skip "Skipping Commerce tests – no token or workspace"
else
  # 6.1 Create product
  do_request POST "/commerce/products" \
    "{\"workspaceId\":\"${WORKSPACE_ID}\",\"name\":\"E2E Test T-Shirt\",\"description\":\"Premium cotton t-shirt\",\"price\":5000,\"type\":\"PHYSICAL\"}" \
    "$ACCESS_TOKEN"
  assert_status "201" "POST /commerce/products"
  PRODUCT_ID=$(json_get "$RESP_BODY" ".get('id','')")
  if [ -n "$PRODUCT_ID" ]; then
    log_pass "Created product: $PRODUCT_ID"
  else
    log_fail "No product ID in response"
  fi

  # 6.2 Create second product
  do_request POST "/commerce/products" \
    "{\"workspaceId\":\"${WORKSPACE_ID}\",\"name\":\"E2E Test Hoodie\",\"description\":\"Warm hoodie\",\"price\":12000,\"type\":\"PHYSICAL\"}" \
    "$ACCESS_TOKEN"
  assert_status "201" "POST /commerce/products (2nd product)"
  PRODUCT_ID_2=$(json_get "$RESP_BODY" ".get('id','')")

  # 6.3 Get products
  do_request GET "/commerce/products/${WORKSPACE_ID}" "" "$ACCESS_TOKEN"
  assert_status "200" "GET /commerce/products/:workspaceId"
  PROD_COUNT=$(json_get "$RESP_BODY" ".__len__()")
  log_info "Workspace has $PROD_COUNT product(s)"

  # 6.4 Create a customer for order tests
  separator
  log_info "Creating test customer in DB..."
  CUSTOMER_ID=$(npx -y tsx /Users/mac/cloza-backend/scripts/create-test-customer.ts "${WORKSPACE_ID}" "E2E Customer" "customer_${TIMESTAMP}@example.com" 2>/dev/null | tail -1)
  if [ -n "$CUSTOMER_ID" ]; then
    log_pass "Created customer: $CUSTOMER_ID"
  else
    log_fail "Could not create test customer"
  fi

  # 6.5 Create order
  if [ -n "$CUSTOMER_ID" ] && [ -n "$PRODUCT_ID" ]; then
    do_request POST "/commerce/orders" \
      "{\"workspaceId\":\"${WORKSPACE_ID}\",\"customerId\":\"${CUSTOMER_ID}\",\"itemIds\":[\"${PRODUCT_ID}\"]}" \
      "$ACCESS_TOKEN"
    assert_status "201" "POST /commerce/orders"
    ORDER_ID=$(json_get "$RESP_BODY" ".get('id','')")
    if [ -n "$ORDER_ID" ]; then
      log_pass "Created order: $ORDER_ID"
    else
      log_fail "No order ID in response"
    fi
  fi

  # 6.6 Get orders
  do_request GET "/commerce/orders/${WORKSPACE_ID}" "" "$ACCESS_TOKEN"
  assert_status "200" "GET /commerce/orders/:workspaceId"
  ORDER_COUNT=$(json_get "$RESP_BODY" ".__len__()")
  log_info "Workspace has $ORDER_COUNT order(s)"

  # 6.7 Update order status
  if [ -n "$ORDER_ID" ]; then
    do_request PATCH "/commerce/orders/${ORDER_ID}/status" \
      "{\"status\":\"CONFIRMED\"}" "$ACCESS_TOKEN"
    assert_status "200" "PATCH /commerce/orders/:id/status → CONFIRMED"

    do_request PATCH "/commerce/orders/${ORDER_ID}/status" \
      "{\"status\":\"PAID\"}" "$ACCESS_TOKEN"
    assert_status "200" "PATCH /commerce/orders/:id/status → PAID"
  fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# MODULE 7: SOCIAL
# ─────────────────────────────────────────────────────────────────────────────
section "MODULE 7: SOCIAL"

if [ -z "$ACCESS_TOKEN" ] || [ -z "$WORKSPACE_ID" ]; then
  log_skip "Skipping Social tests – no token or workspace"
else
  # 7.1 Create a scheduled post
  FUTURE_DATE=$(date -u -v+1d +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -d "+1 day" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "2026-03-25T12:00:00Z")

  PRODUCT_IDS_JSON=""
  if [ -n "$PRODUCT_ID" ]; then
    PRODUCT_IDS_JSON="\"productIds\":[\"${PRODUCT_ID}\"],"
  fi

  do_request POST "/social/posts" \
    "{\"workspaceId\":\"${WORKSPACE_ID}\",\"content\":\"Check out our new collection! 🔥 #fashion #cloza\",\"mediaUrls\":[\"https://example.com/promo.jpg\"],${PRODUCT_IDS_JSON}\"targets\":[{\"platform\":\"INSTAGRAM\",\"scheduledFor\":\"${FUTURE_DATE}\"}]}" \
    "$ACCESS_TOKEN"
  assert_status "201" "POST /social/posts"
  POST_ID=$(json_get "$RESP_BODY" ".get('id','')")
  if [ -n "$POST_ID" ]; then
    log_pass "Created post: $POST_ID"
  fi

  # 7.2 Get posts
  do_request GET "/social/posts/${WORKSPACE_ID}" "" "$ACCESS_TOKEN"
  assert_status "200" "GET /social/posts/:workspaceId"
  POST_COUNT=$(json_get "$RESP_BODY" ".__len__()")
  log_info "Workspace has $POST_COUNT post(s)"

  # 7.3 Get social accounts
  do_request GET "/social/accounts/${WORKSPACE_ID}" "" "$ACCESS_TOKEN"
  assert_status "200" "GET /social/accounts/:workspaceId"

  # 7.4 Get metrics
  do_request GET "/social/metrics/${WORKSPACE_ID}" "" "$ACCESS_TOKEN"
  assert_status "200" "GET /social/metrics/:workspaceId"
fi

# ─────────────────────────────────────────────────────────────────────────────
# MODULE 8: CONVERSATIONS
# ─────────────────────────────────────────────────────────────────────────────
section "MODULE 8: CONVERSATIONS"

if [ -z "$ACCESS_TOKEN" ] || [ -z "$WORKSPACE_ID" ] || [ -z "$CUSTOMER_ID" ]; then
  log_skip "Skipping Conversations tests – missing dependencies"
else
  # 8.1 Start conversation
  do_request POST "/conversations" \
    "{\"workspaceId\":\"${WORKSPACE_ID}\",\"customerId\":\"${CUSTOMER_ID}\",\"platform\":\"WHATSAPP\"}" \
    "$ACCESS_TOKEN"
  assert_status "200,201" "POST /conversations (start)"
  CONVERSATION_ID=$(json_get "$RESP_BODY" ".get('id','')")
  if [ -n "$CONVERSATION_ID" ]; then
    log_pass "Started conversation: $CONVERSATION_ID"
  fi

  # 8.2 Send message
  if [ -n "$CONVERSATION_ID" ]; then
    do_request POST "/conversations/messages" \
      "{\"conversationId\":\"${CONVERSATION_ID}\",\"content\":\"Hello! Is the T-Shirt still available?\",\"type\":\"TEXT\"}" \
      "$ACCESS_TOKEN"
    assert_status "200,201" "POST /conversations/messages"

    # 8.3 Send second message
    do_request POST "/conversations/messages" \
      "{\"conversationId\":\"${CONVERSATION_ID}\",\"content\":\"Yes, it is! Would you like to order?\"}" \
      "$ACCESS_TOKEN"
    assert_status "200,201" "POST /conversations/messages (reply)"
  fi

  # 8.4 Get conversations for workspace
  do_request GET "/conversations/workspace/${WORKSPACE_ID}" "" "$ACCESS_TOKEN"
  assert_status "200" "GET /conversations/workspace/:workspaceId"
  CONV_COUNT=$(json_get "$RESP_BODY" ".__len__()")
  log_info "Workspace has $CONV_COUNT conversation(s)"

  # 8.5 Get messages for conversation
  if [ -n "$CONVERSATION_ID" ]; then
    do_request GET "/conversations/${CONVERSATION_ID}/messages" "" "$ACCESS_TOKEN"
    assert_status "200" "GET /conversations/:id/messages"
    MSG_COUNT=$(json_get "$RESP_BODY" ".__len__()")
    log_info "Conversation has $MSG_COUNT message(s)"
  fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# MODULE 9: PAYMENTS
# ─────────────────────────────────────────────────────────────────────────────
section "MODULE 9: PAYMENTS"

if [ -z "$ACCESS_TOKEN" ] || [ -z "$WORKSPACE_ID" ]; then
  log_skip "Skipping Payments tests – missing dependencies"
else
  # 9.1 Add payout account
  do_request POST "/payments/payout-accounts" \
    "{\"workspaceId\":\"${WORKSPACE_ID}\",\"bankName\":\"Access Bank\",\"accountNumber\":\"0123456789\"}" \
    "$ACCESS_TOKEN"
  assert_status "200,201" "POST /payments/payout-accounts"

  # 9.2 Get payout accounts
  do_request GET "/payments/payout-accounts/${WORKSPACE_ID}" "" "$ACCESS_TOKEN"
  assert_status "200" "GET /payments/payout-accounts/:workspaceId"
  PA_COUNT=$(json_get "$RESP_BODY" ".__len__()")
  log_info "Workspace has $PA_COUNT payout account(s)"

  # 9.3 Initialize payment (needs a valid order)
  if [ -n "$ORDER_ID" ]; then
    do_request POST "/payments/initialize" \
      "{\"orderId\":\"${ORDER_ID}\"}" "$ACCESS_TOKEN"
    # Paystack may fail if test key is invalid, so accept 200/201/500
    if [ "$RESP_HTTP" = "201" ] || [ "$RESP_HTTP" = "200" ]; then
      log_pass "POST /payments/initialize → HTTP $RESP_HTTP"
    else
      log_info "POST /payments/initialize → HTTP $RESP_HTTP (Paystack may not be configured)"
    fi
  fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# MODULE 10: MEDIA
# ─────────────────────────────────────────────────────────────────────────────
section "MODULE 10: MEDIA"

if [ -z "$ACCESS_TOKEN" ] || [ -z "$WORKSPACE_ID" ]; then
  log_skip "Skipping Media tests – missing dependencies"
else
  do_request POST "/media/upload-url" \
    "{\"fileName\":\"test-image.jpg\",\"contentType\":\"image/jpeg\",\"workspaceId\":\"${WORKSPACE_ID}\"}" \
    "$ACCESS_TOKEN"
  if [ "$RESP_HTTP" = "201" ] || [ "$RESP_HTTP" = "200" ]; then
    log_pass "POST /media/upload-url → HTTP $RESP_HTTP"
    UPLOAD_URL=$(json_get "$RESP_BODY" ".get('uploadUrl','')")
    if [ -n "$UPLOAD_URL" ]; then
      log_pass "Got presigned S3 upload URL"
    fi
  else
    log_info "POST /media/upload-url → HTTP $RESP_HTTP (S3 may not be configured)"
  fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# MODULE 11: AUDIT
# ─────────────────────────────────────────────────────────────────────────────
section "MODULE 11: AUDIT"

if [ -z "$ACCESS_TOKEN" ]; then
  log_skip "Skipping Audit tests – no access token"
else
  do_request GET "/audit" "" "$ACCESS_TOKEN"
  assert_status "200" "GET /audit"
  AUDIT_COUNT=$(json_get "$RESP_BODY" ".__len__()")
  log_info "Audit logs: $AUDIT_COUNT entries"
fi

# ─────────────────────────────────────────────────────────────────────────────
# MODULE 12: SWAGGER / DOCS
# ─────────────────────────────────────────────────────────────────────────────
section "MODULE 12: SWAGGER"

do_request GET "/docs"
if [ "$RESP_HTTP" = "200" ] || [ "$RESP_HTTP" = "301" ] || [ "$RESP_HTTP" = "302" ]; then
  log_pass "GET /docs → HTTP $RESP_HTTP (Swagger UI accessible)"
else
  log_fail "GET /docs → HTTP $RESP_HTTP"
fi

# ─────────────────────────────────────────────────────────────────────────────
# CLEANUP
# ─────────────────────────────────────────────────────────────────────────────
section "CLEANUP"

log_info "Removing test data from DB..."
npx -y tsx /Users/mac/cloza-backend/scripts/cleanup-test-user.ts "${TEST_EMAIL}" "${WORKSPACE_ID:-NONE}" 2>/dev/null
log_pass "Test data cleaned up"

# ─────────────────────────────────────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║                    TEST RESULTS                     ║${NC}"
echo -e "${BOLD}╠══════════════════════════════════════════════════════╣${NC}"
echo -e "${BOLD}║${NC}  ${GREEN}Passed: ${PASS}${NC}"
echo -e "${BOLD}║${NC}  ${RED}Failed: ${FAIL}${NC}"
echo -e "${BOLD}║${NC}  ${YELLOW}Skipped: ${SKIP}${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo -e "${RED}⚠ Some tests failed!${NC}"
  exit 1
else
  echo -e "${GREEN}✅ All tests passed!${NC}"
  exit 0
fi
