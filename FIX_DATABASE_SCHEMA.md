# Fix Database Schema - Missing `department` Column

## Problem Identified ✅
```
sqlalchemy.exc.ProgrammingError: column users.department does not exist
```

The `users` table in your Neon PostgreSQL database is missing the `department` column that the code expects.

## Why This Happened
The database was created before the `department` field was added to the User model. SQLAlchemy's `Base.metadata.create_all()` only creates NEW tables, it doesn't update existing ones.

## Solution: Run SQL Migration

### **Option 1: Using Neon SQL Editor (Easiest)**

1. Go to https://console.neon.tech
2. Select your JANMIND database
3. Click **"SQL Editor"** tab
4. Copy and paste this SQL:

```sql
-- Add department column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(100);
```

5. Click **"Run"** button
6. You should see: `ALTER TABLE`
7. Done! ✅

### **Option 2: Using psql Command Line**

If you have PostgreSQL client installed:

```bash
# Get your DATABASE_URL from Render Environment variables
# Then run:
psql "YOUR_DATABASE_URL" -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(100);"
```

### **Option 3: Automated Script (In Backend)**

I created a migration file at: `backend/migrations/add_department_column.sql`

To run it:
```bash
cd backend
psql "YOUR_DATABASE_URL" -f migrations/add_department_column.sql
```

## After Running the Migration

### Test 1: Verify Column Exists
In Neon SQL Editor, run:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY column_name;
```

You should see `department` in the list.

### Test 2: Create Admin Account
Now run the admin creation script again:
```powershell
./create-admin-interactive.ps1
```

Enter:
- OFFICER_API_KEY: `janmind_officer_key_2026_8f9d2e1a3b4c5d6e7f8g9h0i`
- Name: Maher Bhatt
- Email: maherbhatt01@gmail.com
- Password: (your password)

It should work now! ✅

### Test 3: Verify Backend Health
```powershell
./diagnose-backend.ps1
```

All endpoints should now return proper responses (not 500 errors).

## Prevent This in Future

For production deployments, use proper database migrations:

### Setup Alembic (Recommended)

1. Install Alembic:
```bash
cd backend
pip install alembic
```

2. Initialize:
```bash
alembic init alembic
```

3. Configure `alembic.ini` with your DATABASE_URL

4. Create migrations:
```bash
alembic revision --autogenerate -m "Add department column"
```

5. Apply migrations:
```bash
alembic upgrade head
```

### Alternative: Manual Migration Files

Keep SQL migration scripts in `backend/migrations/` and run them manually when deploying schema changes.

## Quick Fix Summary

**JUST DO THIS:**
1. Go to Neon SQL Editor
2. Run: `ALTER TABLE users ADD COLUMN IF NOT EXISTS department VARCHAR(100);`
3. Run: `./create-admin-interactive.ps1`
4. Your admin account will be created! 🎉

---

**Status After Fix:**
- ✅ Database schema updated
- ✅ Backend functional
- ✅ Can create admin accounts
- ✅ All auth endpoints working
