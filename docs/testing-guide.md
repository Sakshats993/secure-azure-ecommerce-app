🧪 Testing Guide
Overview
This guide covers testing procedures for the Secure Azure E-Commerce Application to validate:
Security controls
Functional correctness
Performance
Database integrity
Authentication & authorization
Monitoring & compliance

1️⃣ Security Testing
🔐 HTTPS Verification
# Should redirect to HTTPS
curl -I http://YOUR_APP.azurewebsites.net

# Should return 200
curl -I https://YOUR_APP.azurewebsites.net
🔒 TLS Version Testing
# Check TLS version and supported ciphers
nmap --script ssl-enum-ciphers -p 443 YOUR_APP.azurewebsites.net

Expected Result:
Only TLS 1.2 or higher enabled
TLS 1.0 and 1.1 disabled

Security Headers
curl -I https://YOUR_APP.azurewebsites.net | grep -E "(Strict-Transport|X-Content-Type|X-Frame)"

Expected Headers:
Strict-Transport-Security
X-Content-Type-Options
X-Frame-Options

🚨 WAF Testing
SQL Injection Attempt (Should Be Blocked)
curl "https://YOUR_APP.azurewebsites.net/api/products?search=1'%20OR%20'1'='1"
XSS Attempt (Should Be Blocked)
curl "https://YOUR_APP.azurewebsites.net/api/products?search=<script>alert(1)</script>"

Expected Result:
403 Forbidden
Or WAF block page

2️⃣ Functional Testing
❤️ Health Check
curl https://YOUR_APP.azurewebsites.net/health

Expected:
{"status":"healthy","database":"connected"}
📦 Products API
# Get all products
curl https://YOUR_APP.azurewebsites.net/api/products

# Get single product
curl https://YOUR_APP.azurewebsites.net/api/products/1
🔑 Authentication Testing
Without Token (Should Fail)
curl https://YOUR_APP.azurewebsites.net/api/users/profile

Expected:
401 Unauthorized
With Token (Should Succeed)
curl -H "Authorization: Bearer YOUR_TOKEN" \
https://YOUR_APP.azurewebsites.net/api/users/profile
3️⃣ Performance Testing
🚀 Load Testing (Apache Bench)
ab -n 1000 -c 10 https://YOUR_APP.azurewebsites.net/api/products

-n 1000 → 1000 requests

-c 10 → 10 concurrent users

⏱ Response Time Check
curl -w "@curl-format.txt" -o /dev/null -s \
https://YOUR_APP.azurewebsites.net/api/products

4️⃣ Database Testing
🔌 Connection Test
sqlcmd -S YOUR_SERVER.database.windows.net \
-d sqldb-ecom-dev \
-U sqladmin \
-P 'PASSWORD' \
-Q "SELECT 1"

📊 Data Integrity Checks
-- Check product count
SELECT COUNT(*) FROM Products;

-- Check for orphaned records
SELECT * FROM OrderItems 
WHERE OrderId NOT IN (SELECT OrderId FROM Orders);

5️⃣ Automated Testing
🧪 Run Backend Tests
cd app/backend
npm test
🎨 Run Frontend Tests
cd app/frontend
npm test

6️⃣ Security Scan & Compliance
🔎 Run Security Verification Script
./scripts/verify-security.sh
 Microsoft Defender Assessment

Open Azure Portal
Go to Microsoft Defender for Cloud
Check Secure Score
Review security recommendations

✅ Final Test Checklist
 HTTPS redirect works
 TLS 1.2+ enforced
 Security headers present
 WAF blocks injection/XSS attempts
 Health endpoint returns 200
 Products API works
 Authentication required for protected routes
 Rate limiting works
 Database connection secure
 All automated tests pass