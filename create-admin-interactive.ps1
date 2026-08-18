# Interactive admin creation script for CivicSathi
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   CivicSathi Admin Account Creator" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Test backend connection first
Write-Host "Step 1: Testing backend connection..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://civicsathi.onrender.com/" -Method Get
    Write-Host "SUCCESS: Backend is online!" -ForegroundColor Green
    Write-Host "Environment: $($response.environment)" -ForegroundColor Gray
    Write-Host ""
}
catch {
    Write-Host "ERROR: Cannot connect to backend" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit
}

# Get OFFICER_API_KEY from user
Write-Host "Step 2: Enter your OFFICER_API_KEY" -ForegroundColor Yellow
Write-Host "         (Find this in your Render.com backend Environment variables)" -ForegroundColor Gray
Write-Host ""
$officerKey = Read-Host "OFFICER_API_KEY"
Write-Host ""

# Get admin details
Write-Host "Step 3: Enter admin account details" -ForegroundColor Yellow
Write-Host ""
$adminName = Read-Host "Admin Name (e.g., Admin User)"
$adminEmail = Read-Host "Admin Email (e.g., admin@civicsathi.com)"
$adminPassword = Read-Host "Admin Password (min 8 characters)" -AsSecureString
$adminPasswordText = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($adminPassword))
Write-Host ""

# Confirm
Write-Host "Creating admin account with:" -ForegroundColor Yellow
Write-Host "  Name: $adminName"
Write-Host "  Email: $adminEmail"
Write-Host "  Role: admin"
Write-Host "  City: bengaluru"
Write-Host ""
$confirm = Read-Host "Continue? (y/n)"

if ($confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit
}

# Create admin account
Write-Host ""
Write-Host "Creating admin account..." -ForegroundColor Cyan

$apiUrl = "https://civicsathi.onrender.com/api/v1/auth/admin-setup"

$adminData = @{
    name = $adminName
    email = $adminEmail
    password = $adminPasswordText
    role = "admin"
    city = "bengaluru"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
    "X-Officer-Key" = $officerKey
}

try {
    $result = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $adminData
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "   SUCCESS! Admin Account Created" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Account Details:" -ForegroundColor Yellow
    Write-Host "  Email: $adminEmail"
    Write-Host "  Password: (the password you entered)"
    Write-Host "  Role: $($result.role)"
    Write-Host "  User ID: $($result.user_id)"
    Write-Host ""
    Write-Host "You can now login at your admin frontend!" -ForegroundColor Cyan
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Red
    Write-Host "   ERROR: Failed to Create Admin Account" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
    Write-Host ""
    
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "ERROR: Unauthorized - Your OFFICER_API_KEY is incorrect" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please check your Render.com backend Environment variables:" -ForegroundColor Yellow
        Write-Host "1. Go to https://dashboard.render.com"
        Write-Host "2. Open your CivicSathi backend service"
        Write-Host "3. Click 'Environment' tab"
        Write-Host "4. Find the OFFICER_API_KEY value"
        Write-Host "5. Run this script again with the correct key"
    }
    elseif ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "ERROR: This email already exists in the system" -ForegroundColor Red
        Write-Host ""
        Write-Host "Try logging in with this email, or use a different email address" -ForegroundColor Yellow
    }
    else {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails) {
            Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
        }
    }
    Write-Host ""
}
