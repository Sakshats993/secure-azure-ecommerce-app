# Uncomment and configure for remote state storage in production

# terraform {
#   backend "azurerm" {
#     resource_group_name  = "rg-terraform-state"
#     storage_account_name = "stterraformstate"
#     container_name       = "tfstate"
#     key                  = "secure-ecommerce.tfstate"
#   }
# }

# For local development, state is stored locally
# Run: terraform init