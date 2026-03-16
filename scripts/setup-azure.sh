#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Secure Azure E-Commerce Setup ===${NC}\n"

# Variables
RESOURCE_GROUP="secure-ecom-rg"
LOCATION="centralindia"
ENVIRONMENT="dev"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI not found. Please install it first.${NC}"
    exit 1
fi

# Login to Azure
echo -e "${YELLOW}Logging in to Azure...${NC}"
az login

# Set subscription (if you have multiple)
echo -e "${YELLOW}Available subscriptions:${NC}"
az account list --output table
read -p "Enter subscription ID to use (or press Enter for default): " SUBSCRIPTION_ID

if [ ! -z "$SUBSCRIPTION_ID" ]; then
    az account set --subscription "$SUBSCRIPTION_ID"
fi

# Create resource group
echo -e "${YELLOW}Creating resource group...${NC}"
az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

# Generate SQL password
SQL_PASSWORD=$(openssl rand -base64 20)
echo -e "${GREEN}Generated SQL password (save this securely): ${SQL_PASSWORD}${NC}"

# Deploy infrastructure
echo -e "${YELLOW}Deploying infrastructure...${NC}"
DEPLOYMENT_OUTPUT=$(az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --template-file infrastructure/bicep/main.bicep \
  --parameters environmentName="$ENVIRONMENT" location="$LOCATION" sqlAdminPassword="$SQL_PASSWORD" \
  --output json)

# Extract outputs
WEB_APP_NAME=$(echo $DEPLOYMENT_OUTPUT | jq -r '.properties.outputs.webAppName.value')
KEY_VAULT_NAME=$(echo $DEPLOYMENT_OUTPUT | jq -r '.properties.outputs.keyVaultName.value')
WEB_APP_URL=$(echo $DEPLOYMENT_OUTPUT | jq -r '.properties.outputs.webAppUrl.value')

echo -e "${GREEN}Deployment completed!${NC}"
echo -e "Web App Name: ${WEB_APP_NAME}"
echo -e "Key Vault Name: ${KEY_VAULT_NAME}"
echo -e "Web App URL: ${WEB_APP_URL}"

# Save configuration
cat > deployment-config.json <<EOF
{
  "resourceGroup": "$RESOURCE_GROUP",
  "webAppName": "$WEB_APP_NAME",
  "keyVaultName": "$KEY_VAULT_NAME",
  "webAppUrl": "$WEB_APP_URL",
  "sqlPassword": "$SQL_PASSWORD"
}
EOF

echo -e "${GREEN}Configuration saved to deployment-config.json${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Deploy database schema: ./scripts/deploy-database.sh"
echo "2. Configure Azure AD B2C: ./scripts/setup-azuread-b2c.sh"
echo "3. Deploy application code"