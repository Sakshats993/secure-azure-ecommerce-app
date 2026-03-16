# Security Controls Documentation

## Overview

This document details all security controls implemented in the Secure Azure E-Commerce application.

## 1. Identity & Access Management

### Azure AD B2C Authentication
- **Control**: All users must authenticate via Azure AD B2C
- **Implementation**: MSAL library for frontend, passport-azure-ad for backend
- **Token Validation**: JWT tokens validated on every API request

### Managed Identity
- **Control**: App Service uses System Managed Identity
- **Implementation**: No credentials stored in code
- **Access**: Key Vault, SQL Database via Azure RBAC

### Role-Based Access Control (RBAC)
- **Control**: Least privilege access
- **Implementation**: Azure RBAC roles for all resources
- **Audit**: All role assignments logged

## 2. Network Security

### Virtual Network Integration
- **Control**: App Service integrated with VNet
- **Implementation**: Regional VNet integration
- **Benefit**: Private access to backend services

### Private Endpoints
- **Control**: Backend services not publicly accessible
- **Resources**: SQL Database, Key Vault, Storage
- **Implementation**: Azure Private Link

### Web Application Firewall (WAF)
- **Control**: OWASP Core Rule Set 3.2
- **Mode**: Prevention
- **Rules**: SQL Injection, XSS, RCE protection

### Network Security Groups
- **Control**: Subnet-level traffic filtering
- **Rules**: Allow HTTPS, deny all other inbound

## 3. Data Protection

### Encryption in Transit
- **Control**: TLS 1.2+ enforced
- **Implementation**: HTTPS only, HTTP redirects
- **Headers**: HSTS enabled

### Encryption at Rest
- **Control**: All data encrypted at rest
- **SQL**: Transparent Data Encryption (TDE)
- **Storage**: Azure Storage Service Encryption

### Secret Management
- **Control**: Secrets stored in Azure Key Vault
- **Access**: Managed Identity only
- **Rotation**: Supported via Key Vault

## 4. Application Security

### Security Headers
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'

### Input Validation
- **Control**: All inputs validated
- **Implementation**: Server-side validation
- **Parameterized Queries**: SQL injection prevention

### Rate Limiting
- **Control**: API rate limiting
- **Implementation**: 100 requests per 15 minutes
- **Auth Endpoints**: 5 attempts per 15 minutes

## 5. Monitoring & Logging

### Application Insights
- **Telemetry**: Request tracking, exceptions, dependencies
- **Alerts**: Response time, error rate

### Diagnostic Logs
- **App Service**: HTTP logs, console logs, app logs
- **SQL**: Audit logs, threat detection
- **Key Vault**: Audit events

### Microsoft Defender for Cloud
- **Recommendations**: Continuous security assessment
- **Alerts**: Threat detection
- **Secure Score**: Tracked and improved

## 6. Compliance

### Azure Security Benchmark
- **Control**: Aligned with ASB controls
- **Assessment**: Regular compliance checks

### Audit Logging
- **Control**: All actions logged
- **Retention**: 30 days minimum
- **Export**: Available for compliance audits

## Security Checklist

- [ ] HTTPS enforced
- [ ] TLS 1.2+ only
- [ ] WAF enabled (Prevention mode)
- [ ] Private endpoints configured
- [ ] Managed Identity assigned
- [ ] Key Vault for secrets
- [ ] Application Insights enabled
- [ ] Diagnostic logs enabled
- [ ] Defender for Cloud enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented