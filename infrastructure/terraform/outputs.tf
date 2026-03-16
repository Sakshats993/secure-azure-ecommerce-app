output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "web_app_url" {
  value = "https://${module.app_service.default_hostname}"
}

output "application_gateway_public_ip" {
  value = module.application_gateway.public_ip
}

output "key_vault_name" {
  value = module.key_vault.key_vault_name
}

output "sql_server_fqdn" {
  value = module.sql_database.sql_server_fqdn
}