# Backend 500 Error - Critical Issue Found

## Problem
All authentication endpoints are returning **500 Internal Server Error**:
- ❌ `/api/v1/auth/register` - 500 error
- ❌ `/api/v1/auth/officer-login` - 500 error  
- ❌ `/api/v1/auth/admin-setup` - 500 error

## Root Cause
The backend is deployed but has a runtime error. Common causes:

### 1. Database Connection Issue (Most Likely)
- Neon PostgreSQL connection might be failing
- `DATABASE_URL` environment variable might be incorrect or expired
- Database might be paused/suspended

### 2. Missing Environment Variables
Required variables that might be missing:
- `DATABASE_URL` - PostgreSQL connection string
- `OFFICER_API_KEY` - API key for protected endpoints
- `JWT_SECRET` - Secret for JWT token generation

### 3. Code Runtime Error
- Python dependencies might be missing
- Database tables might not be created
- Migration issue

## How to Fix

### Step 1: Check Render Logs
1. Go to https://dashboard.render.com
2. Click on your JANMIND backend service
3. Click "Logs" tab
4. Look for error messages around the time you tried to create the admin

Common error patterns to look for:
```
sqlalchemy.exc.OperationalError: (psycopg.OperationalError) connection failed
ModuleNotFoundError: No module named '...'
KeyError: 'DATABASE_URL'
```

### Step 2: Verify Environment Variables
1. In Render dashboard, click "Environment" tab
2. Verify these variables exist:
   - ✅ `DATABASE_URL` - Should start with `postgresql://` or `postgresql+psycopg://`
   - ✅ `OFFICER_API_KEY` - Your key: `janmind_officer_key_2026_8f9d2e1a3b4c5d6e7f8g9h0i`
   - ✅ `JWT_SECRET` - Any secure random string
   - ✅ `ENVIRONMENT` - Should be `production`

### Step 3: Check Neon Database
1. Go to https://console.neon.tech
2. Check if your database is active
3. Verify connection string is correct
4. Check if database has been migrated (tables created)

### Step 4: Manual Deploy
If environment variables changed:
1. In Render dashboard, click "Manual Deploy"
2. Select "Clear build cache & deploy"
3. Wait for deployment to complete
4. Check logs for errors

### Step 5: Test Database Connection
Create a simple test in the backend:

```python
# backend/test_db.py
from app.core.database import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✓ Database connection successful")
except Exception as e:
    print(f"✗ Database connection failed: {e}")
```

Run this in Render shell or locally with production DATABASE_URL.

## Temporary Workaround

If the backend issue is blocking you, you can:

1. **Use Local Backend:**
   ```bash
   cd backend
   # Set your local .env with DATABASE_URL pointing to Neon
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Create Admin Directly in Database:**
   Use Neon SQL editor to manually insert an admin user:
   ```sql
   INSERT INTO users (id, role, name, email, password_hash, city, ward, created_at)
   VALUES (
     gen_random_uuid(),
     'admin',
     'Maher Bhatt',
     'maherbhatt01@gmail.com',
     '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5OwDkqUqH4FGu', -- password: Admin123
     'bengaluru',
     'Admin',
     NOW()
   );
   ```
   **Note:** The password hash above is for `Admin123`

## Next Steps

1. **Check Render logs immediately** - This will tell you exactly what's wrong
2. **Verify DATABASE_URL** - Most 500 errors on deploy are database connection issues
3. **Redeploy if needed** - After fixing environment variables
4. **Report back what you see in the logs** - I can help debug the specific error

## Testing After Fix

Once backend is fixed, run:
```powershell
./diagnose-backend.ps1
```

All tests should pass:
- ✅ Root endpoint
- ✅ API docs (disabled in production)
- ✅ Citizen registration
- ✅ Officer login (401 for wrong credentials)
- ✅ Admin setup (with correct key)

---

**Current Status:** 🔴 Backend is deployed but non-functional due to 500 errors  
**Priority:** HIGH - Backend must be fixed before frontend can work  
**Action Required:** Check Render logs for specific error message
