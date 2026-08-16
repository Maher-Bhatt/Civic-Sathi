# Test if backend is running
Write-Host "Testing backend connection..." -ForegroundColor Cyan

$rootUrl = "https://janmind.onrender.com/"

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
    $apiUrl = "https://janmind.onrender.com/api/v1/auth/admin-setup"
    $officerKey = "janmind_officer_key_2020_8f9d2c1a8b4c5d8e7f8a9h0i"
    
    $adminData = @{
        name = "Admin User"
        email = "admin@janmind.com"
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
    Write-Host "Email: admin@janmind.com"
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
