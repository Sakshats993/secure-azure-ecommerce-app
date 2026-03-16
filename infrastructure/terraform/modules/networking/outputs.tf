output "vnet_id" {
  value = azurerm_virtual_network.main.id
}

output "appgw_subnet_id" {
  value = azurerm_subnet.appgw.id
}

output "app_subnet_id" {
  value = azurerm_subnet.app.id
}

output "database_subnet_id" {
  value = azurerm_subnet.database.id
}