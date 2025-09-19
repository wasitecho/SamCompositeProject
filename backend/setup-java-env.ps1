# Java Environment Setup Script for Windows
# Run this script as Administrator for system-wide changes

param(
    [Parameter(Mandatory=$true)]
    [string]$JavaPath
)

Write-Host "Setting up Java environment..." -ForegroundColor Green

# Validate Java installation path
if (-not (Test-Path "$JavaPath\bin\java.exe")) {
    Write-Error "Java installation not found at: $JavaPath"
    Write-Host "Please provide the correct path to your JDK installation (e.g., C:\Program Files\Java\jdk-21.0.1)" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found Java installation at: $JavaPath" -ForegroundColor Green

# Set JAVA_HOME environment variable
try {
    [Environment]::SetEnvironmentVariable("JAVA_HOME", $JavaPath, "Machine")
    Write-Host "JAVA_HOME set to: $JavaPath" -ForegroundColor Green
} catch {
    Write-Warning "Failed to set JAVA_HOME system-wide. Trying user-level..."
    [Environment]::SetEnvironmentVariable("JAVA_HOME", $JavaPath, "User")
    Write-Host "JAVA_HOME set to: $JavaPath (User level)" -ForegroundColor Yellow
}

# Add Java to PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
if ($currentPath -notlike "*$JavaPath\bin*") {
    try {
        $newPath = "$JavaPath\bin;$currentPath"
        [Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
        Write-Host "Added Java to system PATH" -ForegroundColor Green
    } catch {
        Write-Warning "Failed to update system PATH. Trying user-level..."
        $userPath = [Environment]::GetEnvironmentVariable("PATH", "User")
        $newUserPath = "$JavaPath\bin;$userPath"
        [Environment]::SetEnvironmentVariable("PATH", $newUserPath, "User")
        Write-Host "Added Java to user PATH" -ForegroundColor Yellow
    }
} else {
    Write-Host "Java already in PATH" -ForegroundColor Green
}

# Set current session environment
$env:JAVA_HOME = $JavaPath
$env:PATH = "$JavaPath\bin;$env:PATH"

Write-Host "`nVerifying Java installation..." -ForegroundColor Green
try {
    $javaVersion = & "$JavaPath\bin\java.exe" -version 2>&1
    Write-Host "Java Version:" -ForegroundColor Cyan
    Write-Host $javaVersion -ForegroundColor White
    
    $javacVersion = & "$JavaPath\bin\javac.exe" -version 2>&1
    Write-Host "`nJava Compiler Version:" -ForegroundColor Cyan
    Write-Host $javacVersion -ForegroundColor White
} catch {
    Write-Error "Failed to verify Java installation"
}

Write-Host "`nSetup complete! Please restart Cursor IDE and any open terminals." -ForegroundColor Green
Write-Host "To verify in a new terminal, run: java -version" -ForegroundColor Yellow
