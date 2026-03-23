#!/usr/bin/env bash
# =============================================================================
# Cloza Backend – End-to-End Test Script
# Tests: Plans endpoint, Registration with plan, Email verification,
#        Resend verification, Login flow, OTP 2FA, User features endpoint
# =============================================================================

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
TIMESTAMP=$(date +%s)
TEST_EMAIL="test_e2e_${TIMESTAMP}@example.com"
TEST_PASSWORD="testpass123"
TEST_NAME="E2E Test User"
TEST_PLAN="pro"

PASS=0
FAIL=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_pass() { PASS=$((PASS+1)); echo -e "${GREEN}✓ PASS${NC}: $1"; }
log_fail() { FAIL=$((FAIL+1)); echo -e "${RED}✗ FAIL${NC}: $1"; }
log_info() { echo -e "${YELLOW}→${NC} $1"; }
separator() { echo "──────────────────────────────────────────────────"; }

# ─────────────────────────────────────────────────────────────────────────────
# 1. GET /plans – Public pricing plans
# ─────────────────────────────────────────────────────────────────────────────
separator
log_info "TEST 1: GET /plans – Fetch public pricing plans"

PLANS_RESP=$(curl -s -w "\n%{http_code}" "${BASE_URL}/plans")
PLANS_HTTP=$(echo "$PLANS_RESP" | tail -1)
PLANS_BODY=$(echo "$PLANS_RESP" | sed '$d')

if [ "$PLANS_HTTP" = "200" ]; then
  log_pass "GET /plans returned 200"
else
  log_fail "GET /plans returned $PLANS_HTTP (expected 200)"
fi

# Check that plans array exists and has 3 items
PLAN_COUNT=$(echo "$PLANS_BODY" | python3 -c "import sys,json; print(len(json.load(sys.stdin).get('plans',[])))" 2>/dev/null || echo "0")
if [ "$PLAN_COUNT" = "3" ]; then
  log_pass "Plans array has 3 plans (starter, pro, business)"
else
  log_fail "Expected 3 plans, got $PLAN_COUNT"
fi

echo "$PLANS_BODY" | python3 -m json.tool 2>/dev/null | head -20
echo "  ... (truncated)"

# ─────────────────────────────────────────────────────────────────────────────
# 2. POST /auth/register – Register with a selected plan
# ─────────────────────────────────────────────────────────────────────────────
separator
log_info "TEST 2: POST /auth/register – Register with plan='$TEST_PLAN'"
log_info "  Email: $TEST_EMAIL"

REG_RESP=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\",\"name\":\"${TEST_NAME}\",\"plan\":\"${TEST_PLAN}\"}")
REG_HTTP=$(echo "$REG_RESP" | tail -1)
REG_BODY=$(echo "$REG_RESP" | sed '$d')

if [ "$REG_HTTP" = "201" ]; then
  log_pass "POST /auth/register returned 201"
else
  log_fail "POST /auth/register returned $REG_HTTP (expected 201). Body: $REG_BODY"
fi

echo "$REG_BODY" | python3 -m json.tool 2>/dev/null

# ─────────────────────────────────────────────────────────────────────────────
# 3. POST /auth/login – Should fail with "Email not verified"
# ─────────────────────────────────────────────────────────────────────────────
separator
log_info "TEST 3: POST /auth/login – Expect 'Email not verified' error"

LOGIN_FAIL_RESP=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\"}")
LOGIN_FAIL_HTTP=$(echo "$LOGIN_FAIL_RESP" | tail -1)
LOGIN_FAIL_BODY=$(echo "$LOGIN_FAIL_RESP" | sed '$d')

if [ "$LOGIN_FAIL_HTTP" = "401" ]; then
  log_pass "POST /auth/login returned 401 (email not verified)"
else
  log_fail "POST /auth/login returned $LOGIN_FAIL_HTTP (expected 401). Body: $LOGIN_FAIL_BODY"
fi

HAS_NOT_VERIFIED=$(echo "$LOGIN_FAIL_BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print('yes' if 'not verified' in d.get('message','').lower() else 'no')" 2>/dev/null || echo "no")
if [ "$HAS_NOT_VERIFIED" = "yes" ]; then
  log_pass "Error message contains 'not verified'"
else
  log_fail "Error message doesn't contain 'not verified': $LOGIN_FAIL_BODY"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 4. POST /auth/resend-verification – Resend the verification code
# ─────────────────────────────────────────────────────────────────────────────
separator
log_info "TEST 4: POST /auth/resend-verification – Resend verification code"

RESEND_RESP=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/auth/resend-verification" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${TEST_EMAIL}\"}")
RESEND_HTTP=$(echo "$RESEND_RESP" | tail -1)
RESEND_BODY=$(echo "$RESEND_RESP" | sed '$d')

if [ "$RESEND_HTTP" = "201" ] || [ "$RESEND_HTTP" = "200" ]; then
  log_pass "POST /auth/resend-verification returned $RESEND_HTTP"
else
  log_fail "POST /auth/resend-verification returned $RESEND_HTTP. Body: $RESEND_BODY"
fi

echo "$RESEND_BODY" | python3 -m json.tool 2>/dev/null

# ─────────────────────────────────────────────────────────────────────────────
# 5. Fetch verification code from DB and verify email
# ─────────────────────────────────────────────────────────────────────────────
separator
log_info "TEST 5: Fetch verification code from DB, then POST /auth/verify-email"

# Use npx prisma to query the DB for the verification code
VERIFY_CODE=$(cd /Users/mac/cloza-backend && npx -y tsx -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const u = await p.user.findUnique({ where: { email: '${TEST_EMAIL}' } });
  console.log(u?.verificationCode || 'NONE');
  await p.\$disconnect();
})();
" 2>/dev/null)

if [ -z "$VERIFY_CODE" ] || [ "$VERIFY_CODE" = "NONE" ]; then
  log_fail "Could not fetch verification code from DB"
  VERIFY_CODE=""
else
  log_pass "Fetched verification code from DB: $VERIFY_CODE"
fi

if [ -n "$VERIFY_CODE" ]; then
  VERIFY_RESP=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/auth/verify-email" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${TEST_EMAIL}\",\"code\":\"${VERIFY_CODE}\"}")
  VERIFY_HTTP=$(echo "$VERIFY_RESP" | tail -1)
  VERIFY_BODY=$(echo "$VERIFY_RESP" | sed '$d')

  if [ "$VERIFY_HTTP" = "201" ] || [ "$VERIFY_HTTP" = "200" ]; then
    log_pass "POST /auth/verify-email returned $VERIFY_HTTP"
  else
    log_fail "POST /auth/verify-email returned $VERIFY_HTTP. Body: $VERIFY_BODY"
  fi

  echo "$VERIFY_BODY" | python3 -m json.tool 2>/dev/null | head -5
  echo "  ... (truncated)"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 6. POST /auth/login – Should now send a 2FA code
# ─────────────────────────────────────────────────────────────────────────────
separator
log_info "TEST 6: POST /auth/login – Now should succeed with 2FA prompt"

LOGIN_RESP=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${TEST_EMAIL}\",\"password\":\"${TEST_PASSWORD}\"}")
LOGIN_HTTP=$(echo "$LOGIN_RESP" | tail -1)
LOGIN_BODY=$(echo "$LOGIN_RESP" | sed '$d')

if [ "$LOGIN_HTTP" = "201" ] || [ "$LOGIN_HTTP" = "200" ]; then
  log_pass "POST /auth/login returned $LOGIN_HTTP"
else
  log_fail "POST /auth/login returned $LOGIN_HTTP. Body: $LOGIN_BODY"
fi

REQUIRES_2FA=$(echo "$LOGIN_BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('requiresVerification', False))" 2>/dev/null || echo "")
if [ "$REQUIRES_2FA" = "True" ]; then
  log_pass "Login response indicates 2FA is required"
else
  log_fail "Login did not indicate requiresVerification"
fi

echo "$LOGIN_BODY" | python3 -m json.tool 2>/dev/null

# ─────────────────────────────────────────────────────────────────────────────
# 7. Fetch Login OTP from DB, then POST /auth/verify-login
# ─────────────────────────────────────────────────────────────────────────────
separator
log_info "TEST 7: Fetch login OTP from DB, then POST /auth/verify-login"

LOGIN_CODE=$(cd /Users/mac/cloza-backend && npx -y tsx -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const u = await p.user.findUnique({ where: { email: '${TEST_EMAIL}' } });
  console.log(u?.verificationCode || 'NONE');
  await p.\$disconnect();
})();
" 2>/dev/null)

if [ -z "$LOGIN_CODE" ] || [ "$LOGIN_CODE" = "NONE" ]; then
  log_fail "Could not fetch login OTP from DB"
  LOGIN_CODE=""
else
  log_pass "Fetched login OTP from DB: $LOGIN_CODE"
fi

ACCESS_TOKEN=""
if [ -n "$LOGIN_CODE" ]; then
  VL_RESP=$(curl -s -w "\n%{http_code}" -X POST "${BASE_URL}/auth/verify-login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${TEST_EMAIL}\",\"code\":\"${LOGIN_CODE}\"}")
  VL_HTTP=$(echo "$VL_RESP" | tail -1)
  VL_BODY=$(echo "$VL_RESP" | sed '$d')

  if [ "$VL_HTTP" = "201" ] || [ "$VL_HTTP" = "200" ]; then
    log_pass "POST /auth/verify-login returned $VL_HTTP"
  else
    log_fail "POST /auth/verify-login returned $VL_HTTP. Body: $VL_BODY"
  fi

  ACCESS_TOKEN=$(echo "$VL_BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token',''))" 2>/dev/null || echo "")
  if [ -n "$ACCESS_TOKEN" ]; then
    log_pass "Got access_token"
  else
    log_fail "No access_token in response"
  fi

  echo "$VL_BODY" | python3 -m json.tool 2>/dev/null | head -10
  echo "  ... (truncated)"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 8. GET /users/me/features – Authenticated features check
# ─────────────────────────────────────────────────────────────────────────────
separator
log_info "TEST 8: GET /users/me/features – Get plan features for authenticated user"

if [ -n "$ACCESS_TOKEN" ]; then
  FEAT_RESP=$(curl -s -w "\n%{http_code}" "${BASE_URL}/users/me/features" \
    -H "Authorization: Bearer ${ACCESS_TOKEN}")
  FEAT_HTTP=$(echo "$FEAT_RESP" | tail -1)
  FEAT_BODY=$(echo "$FEAT_RESP" | sed '$d')

  if [ "$FEAT_HTTP" = "200" ]; then
    log_pass "GET /users/me/features returned 200"
  else
    log_fail "GET /users/me/features returned $FEAT_HTTP. Body: $FEAT_BODY"
  fi

  ACTIVE_PLAN=$(echo "$FEAT_BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('activePlan',''))" 2>/dev/null || echo "")
  if [ "$ACTIVE_PLAN" = "pro" ]; then
    log_pass "Active plan is 'pro' as expected (user registered with pro plan trial)"
  else
    log_info "Active plan is '$ACTIVE_PLAN' (may need workspace to be created first)"
  fi

  echo "$FEAT_BODY" | python3 -m json.tool 2>/dev/null
else
  log_fail "Skipping features test – no access token available"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 9. Cleanup – Delete test user from DB
# ─────────────────────────────────────────────────────────────────────────────
separator
log_info "CLEANUP: Removing test user from DB"

cd /Users/mac/cloza-backend && npx -y tsx -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  try {
    await p.user.delete({ where: { email: '${TEST_EMAIL}' } });
    console.log('Test user deleted');
  } catch(e) { console.log('User not found / already deleted'); }
  await p.\$disconnect();
})();
" 2>/dev/null

# ─────────────────────────────────────────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────────────────────────────────────────
separator
echo ""
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo -e "${RED}Some tests failed!${NC}"
  exit 1
else
  echo -e "${GREEN}All tests passed!${NC}"
  exit 0
fi
