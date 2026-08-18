# Test if backend is running
Write-Host "Testing backend connection..." -ForegroundColor Cyan

$rootUrl = "https://civic-sathi-f7ml.onrender.com/"

try {
    $response = Invoke-RestMethod -Uri $rootUrl -Method Get
    Write-Host ""
    Write-Host "SUCCESS: Backend is running!" -ForegroundColor Green
    Write-Host "App: $($response.app)"
    Write-Host "Version: $($response.version)"
    Write-Host "Environment: $($response.environment)"
    Write-Host ""
    Write-Host "Now testing admin creation..." -ForegroundColor Cyan
    
    # Try to create admin account
    $apiUrl = "https://civic-sathi-f7ml.onrender.com/api/v1/auth/admin-setup"
    $officerKey = "civicsathi_officer_key_2026_8f9d2e1a3b4c5d6e7f8g9h0i"
    
    $adminData = @{
        name = "Admin User"
        email = "admin@civicsathi.com"
        password = "Admin@123456"
        role = "admin"
        city = "bengaluru"
    } | ConvertTo-Json
    
    $headers = @{
        "Content-Type" = "application/json"
        "X-Officer-Key" = $officerKey
    }
    
    $adminResponse = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $adminData
    Write-Host ""
    Write-Host "Admin account created successfully!" -ForegroundColor Green
    Write-Host "Email: admin@civicsathi.com"
    Write-Host "Password: Admin@123456"
    Write-Host "Role: $($adminResponse.role)"
}
catch {
    Write-Host ""
    Write-Host "ERROR:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
    }
}
