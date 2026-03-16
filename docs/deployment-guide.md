# Deployment Guide

## Prerequisites

### Required Tools
- Azure CLI (v2.50+)
- Node.js (v18+)
- Git
- jq (for bash scripts)

### Required Access
- Azure Subscription with Contributor role
- Ability to create Azure AD B2C tenant
- GitHub account

## Step 1: Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/secure-azure-ecommerce-app.git
cd secure-azure-ecommerce-app
``` 


Step 2: Azure Setup
Login to Azure

```bash
az login
az account set --subscription "Your Subscription Name"
```
Run Setup Script
```bash
chmod +x scripts/*.sh
./scripts/setup-azure.sh
```
This creates:

Resource Group
App Service + Plan
SQL Database
Key Vault
Application Insights
Log Analytics
Configure Azure AD 

```bash
./scripts/setup-azuread-b2c.sh
```

Follow the manual steps in Azure Portal.

Step 3: Deploy Database
```bash
./scripts/deploy-database.sh
```
Or manually via Azure Portal Query Editor.

Step 4: Configure Application
Backend Configuration
```bash
cd app/backend
cp .env.example .env
# Edit .env with your values
```
Frontend Configuration
```bash
cd app/frontend
cp .env.example .env
# Edit .env with your values
```
Step 5: Local Testing
Start Backend
```bash
cd app/backend
npm install
npm run dev
```
Start Frontend
```bash
cd app/frontend
npm install
npm start
```
Step 6: Configure Security
```Bash
./scripts/configure-security.sh
```
Step 7: Deploy to Azure
Option A: GitHub Actions (Recommended)
Create GitHub repository
Add secrets (see README)
Push code to trigger deployment

Step 7: Deploy to Azure
Option A: GitHub Actions (Recommended)
Create GitHub repository
Add secrets (see README)
Push code to trigger deployment
Option B: Manual Deployment

```Bash

cd app/backend
zip -r backend.zip .
az webapp deployment source config-zip \
    --resource-group secure-ecom-rg \
    --name YOUR_APP_NAME \
    --src backend.zip
```
Step 8: Verify Deployment
```Bash

./scripts/verify-security.sh
```

Troubleshooting

Database Connection Issues
Check firewall rules
Verify connection string
Check private endpoint
Authentication Issues

Verify B2C configuration
Check redirect URIs
Validate client IDs

Deployment Failures
Check GitHub Actions logs
Verify Azure credentials
Check resource quotas


