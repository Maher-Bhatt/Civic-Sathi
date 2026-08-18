# Backend diagnostic script
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   CivicSathi Backend Diagnostics" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Root endpoint
Write-Host "Test 1: Checking root endpoint..." -ForegroundColor Yellow
try {
    $root = Invoke-RestMethod -Uri "https://civic-sathi-f7ml.onrender.com/" -Method Get
    Write-Host "SUCCESS" -ForegroundColor Green
    Write-Host "  App: $($root.app)"
    Write-Host "  Version: $($root.version)"
    Write-Host "  Environment: $($root.environment)"
}
catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: API docs (should be disabled in production)
Write-Host "Test 2: Checking API docs..." -ForegroundColor Yellow
try {
    $docs = Invoke-WebRequest -Uri "https://civic-sathi-f7ml.onrender.com/docs" -Method Get
    Write-Host "Docs are enabled (Status: $($docs.StatusCode))" -ForegroundColor Yellow
}
catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "Docs are disabled (expected in production)" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 3: Citizen registration (should work without auth)
Write-Host "Test 3: Testing citizen registration endpoint..." -ForegroundColor Yellow
$testEmail = "test_$(Get-Random)@test.com"
$regData = @{
    name = "Test User"
    email = $testEmail
    phone = "1234567890"
    password = "TestPass123"
} | ConvertTo-Json

$regHeaders = @{
    "Content-Type" = "application/json"
}

try {
    $regResult = Invoke-RestMethod -Uri "https://civic-sathi-f7ml.onrender.com/api/v1/auth/register" -Method Post -Headers $regHeaders -Body $regData
    Write-Host "SUCCESS - Registration endpoint is working" -ForegroundColor Green
    Write-Host "  Created user: $($regResult.citizen.name)"
}
catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails) {
        Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}
Write-Host ""

# Test 4: Officer login (with wrong credentials to check endpoint)
Write-Host "Test 4: Testing officer login endpoint..." -ForegroundColor Yellow
$loginData = @{
    email = "nonexistent@test.com"
    password = "test"
} | ConvertTo-Json

try {
    $loginResult = Invoke-RestMethod -Uri "https://civic-sathi-f7ml.onrender.com/api/v1/auth/officer-login" -Method Post -Headers $regHeaders -Body $loginData
    Write-Host "Unexpected success" -ForegroundColor Yellow
}
catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "SUCCESS - Endpoint is working (401 expected for wrong credentials)" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails) {
            Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
        }
    }
}
Write-Host ""

# Test 5: Admin setup with correct key
Write-Host "Test 5: Testing admin setup endpoint..." -ForegroundColor Yellow
$key = Read-Host "Enter your OFFICER_API_KEY (or press Enter to skip)"

if ($key) {
    $testAdminEmail = "test_admin_$(Get-Random)@test.com"
    $adminData = @{
        name = "Test Admin"
        email = $testAdminEmail
        password = "TestAdmin123"
        role = "admin"
        city = "bengaluru"
    } | ConvertTo-Json
    
    $adminHeaders = @{
        "Content-Type" = "application/json"
        "X-Officer-Key" = $key
    }
    
    try {
        $adminResult = Invoke-RestMethod -Uri "https://civic-sathi-f7ml.onrender.com/api/v1/auth/admin-setup" -Method Post -Headers $adminHeaders -Body $adminData
        Write-Host "SUCCESS - Admin created!" -ForegroundColor Green
        Write-Host "  Email: $testAdminEmail"
        Write-Host "  Role: $($adminResult.role)"
        Write-Host "  User ID: $($adminResult.user_id)"
    }
    catch {
        Write-Host "FAILED: Status $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        if ($_.ErrorDetails) {
            Write-Host "  Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
        }
    }
}
else {
    Write-Host "Skipped (no key provided)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   Diagnostics Complete" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
