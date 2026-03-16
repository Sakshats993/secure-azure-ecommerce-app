#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Azure AD B2C Setup Guide ===${NC}\n"

echo -e "${YELLOW}Steps to configure Azure AD B2C:${NC}\n"

echo "1. Create an Azure AD B2C tenant:"
echo "   - Go to portal.azure.com"
echo "   - Click 'Create a resource' > 'Azure Active Directory B2C'"
echo "   - Follow the wizard to create a new B2C tenant"
echo ""

echo "2. Register your application:"
echo "   - In the B2C tenant, go to 'App registrations'"
echo "   - Click 'New registration'"
echo "   - Name: 'Secure E-Commerce App'"
echo "   - Redirect URI: http://localhost:3001 (for development)"
echo "   - Click 'Register'"
echo ""

echo "3. Configure authentication:"
echo "   - Go to 'Authentication' in your app registration"
echo "   - Enable 'ID tokens' and 'Access tokens'"
echo "   - Add platform: Single-page application"
echo "   - Add redirect URIs for production"
echo ""

echo "4. Create user flows:"
echo "   - In B2C, go to 'User flows'"
echo "   - Click 'New user flow'"
echo "   - Select 'Sign up and sign in'"
echo "   - Name: 'B2C_1_signupsignin'"
echo "   - Select identity providers (Email signup)"
echo "   - Select user attributes to collect"
echo "   - Create the flow"
echo ""

echo "5. Get your configuration values:"
echo "   - Tenant name: [your-tenant].onmicrosoft.com"
echo "   - Client ID: Found in app registration overview"
echo "   - Policy name: B2C_1_signupsignin"
echo ""

echo -e "${YELLOW}Update your .env files with these values!${NC}"