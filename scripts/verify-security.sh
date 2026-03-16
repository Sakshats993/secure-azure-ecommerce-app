#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Security Verification Checklist ===${NC}\n"

# Load configuration
if [ ! -f deployment-config.json ]; then
    echo -e "${RED}deployment-config.json not found. Run setup-azure.sh first.${NC}"
    exit 1
fi

RESOURCE_GROUP=$(jq -r '.resourceGroup' deployment-config.json)
WEB_APP_NAME=$(jq -r '.webAppName' deployment-config.json)
WEB_APP_URL=$(jq -r '.webAppUrl' deployment-config.json)

echo "Verifying security for: $WEB_APP_NAME"
echo "URL: $WEB_APP_URL"
echo ""

PASSED=0
FAILED=0

# Function to check and report
check_result() {
    if [ "$1" == "true" ] || [ "$1" == "True" ] || [ "$1" == "1" ]; then
        echo -e "${GREEN}✓ $2${NC}"
        ((PASSED++))
    else
        echo -e "${RED}✗ $2${NC}"
        ((FAILED++))
    fi
}

# Get Web App configuration
CONFIG=$(az webapp show --resource-group $RESOURCE_GROUP --name $WEB_APP_NAME --query "{httpsOnly:httpsOnly,clientCertEnabled:clientCertEnabled,identity:identity}" -o json)
SITE_CONFIG=$(az webapp config show --resource-group $RESOURCE_GROUP --name $WEB_APP_NAME -o json)

echo -e "${YELLOW}=== Transport Security ===${NC}"

# 1. HTTPS Only
HTTPS_ONLY=$(echo $CONFIG | jq -r '.httpsOnly')
check_result "$HTTPS_ONLY" "HTTPS Only is enabled"

# 2. TLS Version
MIN_TLS=$(echo $SITE_CONFIG | jq -r '.minTlsVersion')
if [ "$MIN_TLS" == "1.2" ]; then
    check_result "true" "Minimum TLS version is 1.2"
else
    check_result "false" "Minimum TLS version is 1.2 (current: $MIN_TLS)"
fi

# 3. HTTP/2
HTTP2=$(echo $SITE_CONFIG | jq -r '.http20Enabled')
check_result "$HTTP2" "HTTP/2 is enabled"

echo ""
echo -e "${YELLOW}=== Access Security ===${NC}"

# 4. FTP Disabled
FTPS_STATE=$(echo $SITE_CONFIG | jq -r '.ftpsState')
if [ "$FTPS_STATE" == "Disabled" ]; then
    check_result "true" "FTP/FTPS is disabled"
else
    check_result "false" "FTP/FTPS is disabled (current: $FTPS_STATE)"
fi

# 5. Managed Identity
IDENTITY=$(echo $CONFIG | jq -r '.identity.type')
if [ "$IDENTITY" != "null" ] && [ "$IDENTITY" != "" ]; then
    check_result "true" "Managed Identity is enabled ($IDENTITY)"
else
    check_result "false" "Managed Identity is enabled"
fi

echo ""
echo -e "${YELLOW}=== Application Security ===${NC}"

# 6. Always On
ALWAYS_ON=$(echo $SITE_CONFIG | jq -r '.alwaysOn')
check_result "$ALWAYS_ON" "Always On is enabled"

# 7. Health Check
HEALTH_CHECK=$(echo $SITE_CONFIG | jq -r '.healthCheckPath')
if [ "$HEALTH_CHECK" != "null" ] && [ "$HEALTH_CHECK" != "" ]; then
    check_result "true" "Health check is configured ($HEALTH_CHECK)"
else
    check_result "false" "Health check is configured"
fi

echo ""
echo -e "${YELLOW}=== Network Tests ===${NC}"

# 8. Test HTTPS Redirect
echo "Testing HTTPS redirect..."
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://${WEB_APP_URL#https://}" 2>/dev/null)
if [ "$HTTP_RESPONSE" == "301" ] || [ "$HTTP_RESPONSE" == "308" ]; then
    check_result "true" "HTTP redirects to HTTPS"
else
    check_result "false" "HTTP redirects to HTTPS (got: $HTTP_RESPONSE)"
fi

# 9. Test HTTPS Connection
echo "Testing HTTPS connection..."
HTTPS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$WEB_APP_URL/health" 2>/dev/null)
if [ "$HTTPS_RESPONSE" == "200" ]; then
    check_result "true" "HTTPS connection successful"
else
    check_result "false" "HTTPS connection successful (got: $HTTPS_RESPONSE)"
fi

# 10. Test Security Headers
echo "Checking security headers..."
HEADERS=$(curl -s -I --max-time 10 "$WEB_APP_URL" 2>/dev/null)

if echo "$HEADERS" | grep -qi "strict-transport-security"; then
    check_result "true" "HSTS header present"
else
    check_result "false" "HSTS header present"
fi

if echo "$HEADERS" | grep -qi "x-content-type-options"; then
    check_result "true" "X-Content-Type-Options header present"
else
    check_result "false" "X-Content-Type-Options header present"
fi

if echo "$HEADERS" | grep -qi "x-frame-options"; then
    check_result "true" "X-Frame-Options header present"
else
    check_result "false" "X-Frame-Options header present"
fi

echo ""
echo -e "${GREEN}=== Summary ===${NC}"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -gt 0 ]; then
    echo -e "${YELLOW}Run ./scripts/configure-security.sh to fix issues${NC}"
    exit 1
else
    echo -e "${GREEN}All security checks passed!${NC}"
    exit 0
fi