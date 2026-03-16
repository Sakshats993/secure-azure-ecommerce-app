output "app_service_id" {
  value = azurerm_linux_web_app.main.id
}

output "app_service_name" {
  value = azurerm_linux_web_app.main.name
}

output "default_hostname" {
  value = azurerm_linux_web_app.main.default_hostname
}

output "app_service_plan_id" {
  value = azurerm_service_plan.main.id
}

output "managed_identity_principal_id" {
  value = azurerm_linux_web_app.main.identity[0].principal_id
}

output "managed_identity_tenant_id" {
  value = azurerm_linux_web_app.main.identity[0].tenant_id
}

output "application_insights_connection_string" {
  value     = azurerm_application_insights.main.connection_string
  sensitive = true
}

output "application_insights_instrumentation_key" {
  value     = azurerm_application_insights.main.instrumentation_key
  sensitive = true
}