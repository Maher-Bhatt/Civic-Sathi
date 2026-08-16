# PowerShell script to create admin account for JANMIND

Write-Host "Creating admin account..." -ForegroundColor Cyan

$apiUrl = "https://janmind.onrender.com/api/v1/auth/admin-setup"
$officerKey = "janmind_officer_key_2020_8f9d2c1a8b4c5d8e7f8a9h0i"

# Admin details - CHANGE THESE TO YOUR DESIRED VALUES
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

try {
    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $adminData
    Write-Host ""
    Write-Host "SUCCESS: Admin account created!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Account Details:" -ForegroundColor Yellow
    Write-Host "  Email: admin@janmind.com"
    Write-Host "  Password: Admin@123456"
    Write-Host "  Role: $($response.role)"
    Write-Host "  User ID: $($response.user_id)"
    Write-Host ""
    Write-Host "You can now login at your admin frontend!" -ForegroundColor Cyan
}
catch {
    Write-Host ""
    Write-Host "ERROR: Failed to create admin account" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
