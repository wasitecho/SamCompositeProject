Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Updating Product Details Size Table Structure" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This script will update the product_details_size table to use length and breadth columns" -ForegroundColor Yellow
Write-Host "instead of the sizeName column." -ForegroundColor Yellow
Write-Host ""
Write-Host "WARNING: This will modify your database structure!" -ForegroundColor Red
Write-Host "Make sure you have a backup before proceeding." -ForegroundColor Red
Write-Host ""
Read-Host "Press Enter to continue or Ctrl+C to cancel"

Write-Host ""
Write-Host "Running database migration..." -ForegroundColor Green
Write-Host ""

try {
    # Run the SQL migration script
    mysql -u root -p professional_plastics -e "source update-size-table-structure.sql"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Database migration completed successfully!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "The product_details_size table has been updated to use:" -ForegroundColor White
        Write-Host "- length (INT) - Product length in mm" -ForegroundColor White
        Write-Host "- breadth (INT) - Product breadth in mm" -ForegroundColor White
        Write-Host "- sizeName is now computed as 'length x breadth'" -ForegroundColor White
        Write-Host ""
        Write-Host "You can now restart your Spring Boot application." -ForegroundColor Green
    } else {
        throw "MySQL command failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Database migration failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check the error messages above and try again." -ForegroundColor Yellow
    Write-Host "Make sure MySQL is running and you have the correct credentials." -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"
