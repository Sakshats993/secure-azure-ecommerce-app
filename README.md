# Secure Azure E‑Commerce Web App

A **security‑focused cloud‑native e‑commerce application** designed using **Microsoft Azure, Infrastructure‑as‑Code, and DevSecOps practices**.

This project demonstrates how to design and secure a modern web application using **Azure services, secure architecture patterns, automated infrastructure provisioning, and CI/CD security pipelines**.

The goal of this project is to showcase **real‑world cloud security architecture and DevSecOps workflows** used in production‑grade systems.

---

# Project Highlights

- Secure **cloud architecture design**
- **Infrastructure as Code** using Bicep and Terraform
- **DevSecOps pipeline with automated security scanning**
- Secure authentication using **Microsoft Entra ID (Azure AD)**
- Secrets management using **Azure Key Vault**
- Network security using **Virtual Networks and WAF**
- Logging and monitoring with **Azure Monitor and Application Insights**

---

# Architecture Overview

The application follows a **layered cloud security architecture**.

```
User
 │
 ▼
Azure Application Gateway (WAF)
 │
 ▼
Azure App Service (Frontend + Backend API)
 │
 ▼
Azure Virtual Network
 │
 ├── Azure SQL Database
 ├── Azure Key Vault
 └── Azure Monitor / Logging
```

### Key Architecture Components

| Component | Purpose |
|-----------|--------|
| Azure App Service | Hosts the web application (frontend + backend API) |
| Azure SQL Database | Stores application data |
| Azure Key Vault | Secure storage for secrets and certificates |
| Azure Application Gateway + WAF | Protects against web attacks (OWASP rules) |
| Azure Virtual Network | Provides network isolation |
| Azure Monitor & Log Analytics | Logging, monitoring, and alerting |

---

# Security Features

Security is implemented across **identity, application, infrastructure, and deployment layers**.

## Authentication & Identity

- Microsoft **Entra ID (Azure AD)** authentication
- Optional **Azure AD B2C** for customer identity
- **Managed Identity** for secure Azure resource access
- **Role-Based Access Control (RBAC)** for least‑privilege permissions
- Support for **Multi‑Factor Authentication (MFA)**

---

## Data Protection

### Encryption in Transit
- HTTPS enforced
- TLS 1.2+
- HSTS enabled

### Encryption at Rest
- Azure SQL encryption
- Azure Storage encryption
- Encrypted App Service storage

### Secrets Management
- Secrets stored in **Azure Key Vault**
- Secure retrieval via **Managed Identity**
- No credentials stored in source code

---

## Network Security

- Virtual Network integration
- Private endpoints for backend services
- Web Application Firewall (WAF)
- IP access restrictions
- Optional Azure Firewall for outbound filtering
- Azure platform **DDoS protection**

---

# DevSecOps Pipeline

Security is integrated directly into the **CI/CD workflow**.

## Continuous Integration

Pull request pipelines perform:

- Build and lint checks
- Static code analysis
- Dependency vulnerability scanning
- Secret detection
- Security scanning

## Continuous Deployment

Deployment workflow:

1. Build application artifacts  
2. Deploy to staging environment  
3. Run automated tests  
4. Manual approval before production deployment  

---

# Infrastructure as Code

All cloud infrastructure is defined using **Infrastructure as Code**.

### Tools Used

- **Bicep**
- **Terraform**

### Provisioned Infrastructure

- Azure App Service
- Azure SQL Database
- Azure Key Vault
- Azure Application Gateway
- Azure Virtual Network
- Monitoring resources

Benefits:

- reproducible deployments
- version‑controlled infrastructure
- automated provisioning
- consistent security configuration

---

# Logging & Monitoring

Observability is implemented using Azure monitoring services.

### Monitoring Stack

- Azure Monitor
- Log Analytics
- Application Insights

### Alerts

Alerts can be configured for:

- HTTP 5xx errors
- performance anomalies
- unusual traffic patterns
- security events

---

# DevSecOps Security Practices

The project follows **secure development practices**:

- OWASP Top 10 mitigation
- dependency vulnerability scanning
- automated secret detection
- secure service connections
- infrastructure security validation

### Security Headers

```
Content-Security-Policy
X-Frame-Options
X-Content-Type-Options
Strict-Transport-Security
```

---

# Tech Stack

## Cloud Platform

Microsoft Azure

## Azure Services

- Azure App Service
- Azure SQL Database
- Azure Key Vault
- Azure Application Gateway
- Azure Virtual Network
- Azure Monitor
- Microsoft Defender for Cloud
- Azure AD (Entra ID)

## Infrastructure

- Bicep
- Terraform

## DevOps

- GitHub Actions
- CI/CD pipelines
- Security scanning tools

## Application

- Node.js backend
- React frontend

---

# Repository Structure

```secure-azure-ecommerce-app/
│
├── .github/
│   └── workflows/
│       ├── deploy.yml
│       └── security-scan.yml
│
├── app/
│   ├── backend/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── azureAuth.js
│   │   │   └── keyVault.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── security.js
│   │   ├── routes/
│   │   │   ├── products.js
│   │   │   ├── users.js
│   │   │   └── orders.js
│   │   ├── models/
│   │   │   ├── product.js
│   │   │   ├── user.js
│   │   │   └── order.js
│   │   ├── utils/
│   │   │   └── logger.js
│   │   ├── server.js
│   │   ├── package.json
│   │   ├── .env.example
│   │   └── .gitignore
│   │
│   └── frontend/
│       ├── public/
│       │   ├── index.html
│       │   └── manifest.json
│       ├── src/
│       │   ├── components/
│       │   │   ├── Auth/
│       │   │   │   ├── Login.jsx
│       │   │   │   └── ProtectedRoute.jsx
│       │   │   ├── Products/
│       │   │   │   ├── ProductList.jsx
│       │   │   │   ├── ProductCard.jsx
│       │   │   │   └── ProductDetail.jsx
│       │   │   ├── Cart/
│       │   │   │   ├── Cart.jsx
│       │   │   │   └── CartItem.jsx
│       │   │   ├── Layout/
│       │   │   │   ├── Header.jsx
│       │   │   │   ├── Footer.jsx
│       │   │   │   └── Navbar.jsx
│       │   │   └── Common/
│       │   │       ├── Loading.jsx
│       │   │       └── ErrorBoundary.jsx
│       │   ├── services/
│       │   │   ├── api.js
│       │   │   ├── auth.service.js
│       │   │   └── product.service.js
│       │   ├── context/
│       │   │   ├── AuthContext.jsx
│       │   │   └── CartContext.jsx
│       │   ├── utils/
│       │   │   └── msalConfig.js
│       │   ├── App.jsx
│       │   ├── App.css
│       │   ├── index.js
│       │   └── index.css
│       ├── package.json
│       ├── .env.example
│       └── .gitignore
│
├── infrastructure/
│   ├── bicep/
│   │   ├── main.bicep
│   │   ├── modules/
│   │   │   ├── app-service.bicep
│   │   │   ├── sql-database.bicep
│   │   │   ├── key-vault.bicep
│   │   │   ├── application-gateway.bicep
│   │   │   ├── vnet.bicep
│   │   │   └── monitoring.bicep
│   │   ├── parameters.dev.json
│   │   └── parameters.prod.json
│   │
│   └── terraform/
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       ├── providers.tf
│       ├── modules/
│       │   ├── app-service/
│       │   │   ├── main.tf
│       │   │   ├── variables.tf
│       │   │   └── outputs.tf
│       │   ├── sql-database/
│       │   │   ├── main.tf
│       │   │   ├── variables.tf
│       │   │   └── outputs.tf
│       │   ├── key-vault/
│       │   │   ├── main.tf
│       │   │   ├── variables.tf
│       │   │   └── outputs.tf
│       │   ├── application-gateway/
│       │   │   ├── main.tf
│       │   │   ├── variables.tf
│       │   │   └── outputs.tf
│       │   └── networking/
│       │       ├── main.tf
│       │       ├── variables.tf
│       │       └── outputs.tf
│       ├── terraform.tfvars.example
│       └── backend.tf
│
├── database/
│   ├── schema/
│   │   ├── 001_create_tables.sql
│   │   ├── 002_create_indexes.sql
│   │   └── 003_seed_data.sql
│   └── migrations/
│       └── README.md
│
├── scripts/
│   ├── setup-azure.sh
│   ├── deploy-infrastructure.sh
│   ├── configure-security.sh
│   ├── setup-azuread-b2c.sh
│   └── verify-security.sh
│
├── docs/
│   ├── architecture.md
│   ├── security-controls.md
│   ├── deployment-guide.md
│   ├── testing-guide.md
│   └── images/
│       └── architecture-diagram.png
│
├── .gitignore
├── README.md
└── LICENSE
```

---

# Future Improvements

- Deploy infrastructure to Azure
- Add monitoring dashboards
- Containerized deployment using Docker
- Kubernetes deployment with AKS
- Automated security testing

---

# Learning Objectives

This project demonstrates knowledge of:

- Cloud security architecture
- DevSecOps practices
- Infrastructure as Code
- Identity & access management
- Secure cloud application design

---

# Disclaimer

This project is built **for educational purposes** to demonstrate secure cloud architecture and DevSecOps practices.

---

# Project Authors

This project was developed collaboratively.

### Sakshat S
GitHub: https://github.com/Sakshats993

### Swasthi Kunder
GitHub: https://github.com/swasthikunder