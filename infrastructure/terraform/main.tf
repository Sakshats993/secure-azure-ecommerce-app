resource "random_string" "unique" {
  length  = 6
  special = false
  upper   = false
}

locals {
  unique_suffix = random_string.unique.result
  resource_prefix = "${var.project_name}-${var.environment}"
  
  tags = {
    Environment = var.environment
    Project     = "Secure E-Commerce"
    ManagedBy   = "Terraform"
  }
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "rg-${local.resource_prefix}-${local.unique_suffix}"
  location = var.location
  tags     = local.tags
}

# Virtual Network
module "networking" {
  source = "./modules/networking"
  
  resource_group_name = azurerm_resource_group.main.name
  location           = var.location
  environment        = var.environment
  unique_suffix      = local.unique_suffix
  tags               = local.tags
}

# Key Vault
module "key_vault" {
  source = "./modules/key-vault"
  
  resource_group_name = azurerm_resource_group.main.name
  location           = var.location
  environment        = var.environment
  unique_suffix      = local.unique_suffix
  tags               = local.tags
}

# SQL Database
module "sql_database" {
  source = "./modules/sql-database"
  
  resource_group_name = azurerm_resource_group.main.name
  location           = var.location
  environment        = var.environment
  unique_suffix      = local.unique_suffix
  admin_password     = var.sql_admin_password
  subnet_id          = module.networking.database_subnet_id
  tags               = local.tags
}

# App Service
module "app_service" {
  source = "./modules/app-service"
  
  resource_group_name     = azurerm_resource_group.main.name
  location               = var.location
  environment            = var.environment
  unique_suffix          = local.unique_suffix
  subnet_id              = module.networking.app_subnet_id
  key_vault_id           = module.key_vault.key_vault_id
  sql_connection_string  = module.sql_database.connection_string
  allowed_ip_addresses   = var.allowed_ip_addresses
  tags                   = local.tags
}

# Application Gateway with WAF
module "application_gateway" {
  source = "./modules/application-gateway"
  
  resource_group_name = azurerm_resource_group.main.name
  location           = var.location
  environment        = var.environment
  unique_suffix      = local.unique_suffix
  subnet_id          = module.networking.appgw_subnet_id
  backend_fqdn       = module.app_service.default_hostname
  tags               = local.tags
}