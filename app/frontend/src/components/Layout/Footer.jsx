import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Secure E-Commerce</h3>
          <p>Built with Azure Security Best Practices</p>
        </div>

        <div className="footer-section">
          <h4>Security Features</h4>
          <ul>
            <li>🔒 HTTPS/TLS Encryption</li>
            <li>🛡️ Web Application Firewall</li>
            <li>🔐 Azure AD B2C Authentication</li>
            <li>📊 Application Insights Monitoring</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Azure Services</h4>
          <ul>
            <li>App Service</li>
            <li>SQL Database</li>
            <li>Key Vault</li>
            <li>Application Gateway</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Compliance</h4>
          <ul>
            <li>Azure Security Benchmark</li>
            <li>PCI-DSS Ready</li>
            <li>GDPR Compliant</li>
            <li>SOC 2 Type II</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Secure E-Commerce. Part of Azure Security Portfolio.</p>
        <p>🔐 Protected by Microsoft Azure</p>
      </div>
    </footer>
  );
};

export default Footer;