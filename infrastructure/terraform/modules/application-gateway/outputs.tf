output "application_gateway_id" {
  value = azurerm_application_gateway.main.id
}

output "public_ip" {
  value = azurerm_public_ip.appgw.ip_address
}

output "public_fqdn" {
  value = azurerm_public_ip.appgw.fqdn
}

output "waf_policy_id" {
  value = azurerm_web_application_firewall_policy.main.id
}