# How to Create Your First Admin Account

## Quick Steps:

### Option 1: Using PowerShell Script (Recommended)

1. Open PowerShell in this folder
2. Run: `./create-admin-interactive.ps1`
3. Follow the prompts:
   - Enter your `OFFICER_API_KEY` from Render.com
   - Enter admin name, email, and password
   - Confirm creation

### Option 2: Using curl/Postman

**Find your OFFICER_API_KEY:**
1. Go to https://dashboard.render.com
2. Click on your "Civic Sathi backend" service
3. Click "Environment" tab
4. Find `OFFICER_API_KEY` value (something like: `civicsathi_officer_key_...`)

**Create admin account:**

```bash
curl -X POST https://civicsathi.onrender.com/api/v1/auth/admin-setup \
  -H "Content-Type: application/json" \
  -H "X-Officer-Key: YOUR_ACTUAL_OFFICER_API_KEY" \
  -d '{
    "name": "Admin User",
    "email": "admin@civicsathi.com",
    "password": "YourPassword123",
    "role": "admin",
    "city": "bengaluru"
  }'
```

**Replace:**
- `YOUR_ACTUAL_OFFICER_API_KEY` with the key from Render.com
- Change email and password to your desired values

### Option 3: Manual in PowerShell

```powershell
# Set your actual OFFICER_API_KEY here
$key = "YOUR_ACTUAL_KEY_FROM_RENDER"

$body = @{
    name = "Admin User"
    email = "admin@civicsathi.com"  
    password = "Admin@123456"
    role = "admin"
    city = "bengaluru"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "X-Officer-Key" = $key
}

Invoke-RestMethod -Uri "https://civicsathi.onrender.com/api/v1/auth/admin-setup" -Method Post -Headers $headers -Body $body
```

## After Creating Admin:

1. Go to your admin frontend (Vercel deployment)
2. Click "Login"
3. Enter the email and password you just created
4. You're in! 🎉

## Troubleshooting:

**401 Unauthorized Error:**
- Your OFFICER_API_KEY is wrong
- Check Render.com Environment variables again
- Make sure you copied the entire key

**409 Conflict Error:**
- This email already exists
- Try a different email, or login with existing credentials

**404 Not Found:**
- Backend might be sleeping (Render free tier)
- Wait 30 seconds and try again

**Connection Error:**
- Check if backend is deployed on Render
- Try accessing: https://civicsathi.onrender.com/

## Need Help?

The `OFFICER_API_KEY` from your screenshot was:
```
civicsathi_officer_key_2020_8f9d2c1a8b4c5d8e7f8a9h0i
```

If this key doesn't work (401 error), it means Render has a different key set.
You MUST get the actual key from Render.com Environment tab.
