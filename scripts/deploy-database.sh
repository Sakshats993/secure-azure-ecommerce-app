#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Deploy Database Schema ===${NC}\n"

# Load configuration
if [ ! -f deployment-config.json ]; then
    echo -e "${RED}deployment-config.json not found. Run setup-azure.sh first.${NC}"
    exit 1
fi

SQL_SERVER=$(jq -r '.sqlServerFqdn' deployment-config.json)
SQL_DATABASE="sqldb-ecom-dev"
SQL_PASSWORD=$(jq -r '.sqlPassword' deployment-config.json)

echo -e "${YELLOW}Deploying database schema...${NC}"

# Deploy schema files
for sql_file in database/schema/*.sql; do
    echo "Executing: $sql_file"
    sqlcmd -S "$SQL_SERVER" -d "$SQL_DATABASE" -U sqladmin -P "$SQL_PASSWORD" -i "$sql_file"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $sql_file executed successfully${NC}"
    else
        echo -e "${RED}✗ Failed to execute $sql_file${NC}"
    fi
done

echo -e "${GREEN}Database deployment completed!${NC}"