# Architecture Documentation

## Overview

This document describes the architecture of the Secure Azure E-Commerce application.

## High-Level Architecture
┌──────────────────────────────────────────────────────────────┐
│                           INTERNET                           │
└──────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                 Azure Front Door / CDN                       │
│               (Global Routing + DDoS Protection)             │
└──────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                 Application Gateway                          │
│              (Web Application Firewall - OWASP)              │
└──────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                       Virtual Network                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                App Service Subnet                      │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │                Azure App Service                 │  │  │
│  │  │                                                  │  │  │
│  │  │  React SPA (Frontend)  ─────▶  Node.js API      │  │  │
│  │  │                                                  │  │  │
│  │  │  Managed Identity (No Secrets in Code)           │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                Private Endpoints Subnet                │  │
│  │                                                        │  │
│  │  Azure Key Vault      (Secrets & Certificates)         │  │
│  │  Azure SQL Database   (TDE Enabled, Firewall Locked)   │  │
│  │  Azure Storage        (Encrypted at Rest)              │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘


               🔐 Authentication & Identity Layer
┌──────────────────────────────────────────────────────────────┐
│                     Azure AD B2C / Entra ID                  │
│                 - User Authentication (OAuth2)               │
│                 - JWT Token Issuance                         │
│                 - Role-Based Access Control (RBAC)           │
└──────────────────────────────────────────────────────────────┘


               📊 Monitoring & Security Operations
┌──────────────────────────────────────────────────────────────┐
│                       Azure Monitor                          │
│   - Application Insights                                     │
│   - Log Analytics                                            │
│   - Microsoft Defender for Cloud                             │
└──────────────────────────────────────────────────────────────┘

## Components

### 1. Frontend (React SPA)
- Single Page Application
- Azure AD B2C authentication
- Responsive design
- Security headers implemented

### 2. Backend (Node.js API)
- RESTful API
- Express.js framework
- JWT token validation
- Rate limiting
- Input validation

### 3. Database (Azure SQL)
- Transparent Data Encryption
- Private endpoint access
- Auditing enabled
- Threat detection

### 4. Security Services
- Azure Key Vault (secrets)
- Application Gateway with WAF
- Azure AD B2C (identity)
- Microsoft Defender for Cloud

### 5. Monitoring
- Application Insights
- Log Analytics
- Azure Monitor Alerts

## Data Flow

1. User accesses application via HTTPS
2. Traffic passes through Azure Front Door (optional)
3. Application Gateway inspects with WAF
4. Request reaches App Service
5. Backend validates JWT token with Azure AD B2C
6. Backend accesses database via private endpoint
7. Secrets retrieved from Key Vault using managed identity
8. Response returned to user

## Security Zones

- **DMZ**: Application Gateway, WAF
- **Application Tier**: App Service, VNet Integration
- **Data Tier**: SQL Database, Storage (Private Endpoints)
- **Management**: Key Vault, Azure AD, Monitor