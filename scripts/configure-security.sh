#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Configure Azure Security Settings ===${NC}\n"

# Load configuration
if [ ! -f deployment-config.json ]; then
    echo -e "${RED}deployment-config.json not found. Run setup-azure.sh first.${NC}"
    exit 1
fi

RESOURCE_GROUP=$(jq -r '.resourceGroup' deployment-config.json)
WEB_APP_NAME=$(jq -r '.webAppName' deployment-config.json)
KEY_VAULT_NAME=$(jq -r '.keyVaultName' deployment-config.json)

echo -e "${YELLOW}Configuring security for:${NC}"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Web App: $WEB_APP_NAME"
echo "  Key Vault: $KEY_VAULT_NAME"
echo ""

# 1. Enable HTTPS Only
echo -e "${YELLOW}1. Enabling HTTPS Only...${NC}"
az webapp update \
    --resource-group $RESOURCE_GROUP \
    --name $WEB_APP_NAME \
    --set httpsOnly=true
echo -e "${GREEN}✓ HTTPS Only enabled${NC}"

# 2. Set Minimum TLS Version
echo -e "${YELLOW}2. Setting minimum TLS version to 1.2...${NC}"
az webapp config set \
    --resource-group $RESOURCE_GROUP \
    --name $WEB_APP_NAME \
    --min-tls-version 1.2
echo -e "${GREEN}✓ TLS 1.2 minimum set${NC}"

# 3. Disable FTP
echo -e "${YELLOW}3. Disabling FTP/FTPS...${NC}"
az webapp config set \
    --resource-group $RESOURCE_GROUP \
    --name $WEB_APP_NAME \
    --ftps-state Disabled
echo -e "${GREEN}✓ FTP disabled${NC}"

# 4. Enable Always On
echo -e "${YELLOW}4. Enabling Always On...${NC}"
az webapp config set \
    --resource-group $RESOURCE_GROUP \
    --name $WEB_APP_NAME \
    --always-on true
echo -e "${GREEN}✓ Always On enabled${NC}"

# 5. Enable HTTP/2
echo -e "${YELLOW}5. Enabling HTTP/2...${NC}"
az webapp config set \
    --resource-group $RESOURCE_GROUP \
    --name $WEB_APP_NAME \
    --http20-enabled true
echo -e "${GREEN}✓ HTTP/2 enabled${NC}"

# 6. Configure Health Check
echo -e "${YELLOW}6. Configuring Health Check...${NC}"
az webapp config set \
    --resource-group $RESOURCE_GROUP \
    --name $WEB_APP_NAME \
    --health-check-path /health
echo -e "${GREEN}✓ Health check configured${NC}"

# 7. Enable Managed Identity
echo -e "${YELLOW}7. Enabling System Managed Identity...${NC}"
IDENTITY_OUTPUT=$(az webapp identity assign \
    --resource-group $RESOURCE_GROUP \
    --name $WEB_APP_NAME)
PRINCIPAL_ID=$(echo $IDENTITY_OUTPUT | jq -r '.principalId')
echo -e "${GREEN}✓ Managed Identity enabled (Principal ID: $PRINCIPAL_ID)${NC}"

# 8. Grant Key Vault Access
echo -e "${YELLOW}8. Granting Key Vault access to Web App...${NC}"
az role assignment create \
    --role "Key Vault Secrets User" \
    --assignee $PRINCIPAL_ID \
    --scope /subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEY_VAULT_NAME
echo -e "${GREEN}✓ Key Vault access granted${NC}"

# 9. Enable Defender for Cloud
echo -e "${YELLOW}9. Enabling Microsoft Defender for Cloud...${NC}"
az security pricing create --name AppServices --tier Standard 2>/dev/null || true
az security pricing create --name SqlServers --tier Standard 2>/dev/null || true
az security pricing create --name KeyVaults --tier Standard 2>/dev/null || true
echo -e "${GREEN}✓ Defender for Cloud enabled${NC}"

# 10. Enable Diagnostic Logs
echo -e "${YELLOW}10. Enabling Diagnostic Logs...${NC}"
az webapp log config \
    --resource-group $RESOURCE_GROUP \
    --name $WEB_APP_NAME \
    --application-logging filesystem \
    --detailed-error-messages true \
    --failed-request-tracing true \
    --web-server-logging filesystem \
    --level information
echo -e "${GREEN}✓ Diagnostic logs enabled${NC}"

echo ""
echo -e "${GREEN}=== Security Configuration Complete ===${NC}"
echo ""
echo -e "${YELLOW}Recommended Next Steps:${NC}"
echo "1. Configure Azure AD B2C authentication"
echo "2. Set up Application Gateway with WAF"
echo "3. Configure Private Endpoints"
echo "4. Review Microsoft Defender for Cloud recommendations"
echo "5. Set up alerts in Azure Monitor"