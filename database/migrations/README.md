
### `database/migrations/README.md`

```markdown
# Database Migrations

## Overview

This folder contains database migration scripts for version control.

## Migration Naming 
XXX_description.sql

Where XXX is a sequential number (001, 002, etc.)

## Running Migrations

### Using Azure Portal
1. Open Azure Portal
2. Navigate to your SQL Database
3. Open Query Editor
4. Login with credentials
5. Run migration scripts in order

### Using SQLCMD
```bash
sqlcmd -S server.database.windows.net -d database -U admin -P password -i migration.sql
```

Current Migrations
Number	Description	Status
001	Create tables	Applied
002	Create indexes	Applied
003	Seed data	Applied
Creating New Migration
Create new file: XXX_description.sql
Write migration SQL
Test locally
Apply to staging
Apply to production