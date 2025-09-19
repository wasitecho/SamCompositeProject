# Maven Installation Script for Windows
Write-Host "Installing Maven..." -ForegroundColor Green

# Create Maven directory
$mavenDir = "C:\Program Files\Apache\maven"
$mavenVersion = "3.9.6"
$mavenUrl = "https://archive.apache.org/dist/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
$mavenZip = "$env:TEMP\maven.zip"

try {
    # Create directory
    if (-not (Test-Path $mavenDir)) {
        New-Item -ItemType Directory -Path $mavenDir -Force
        Write-Host "Created Maven directory: $mavenDir" -ForegroundColor Green
    }

    # Download Maven
    Write-Host "Downloading Maven $mavenVersion..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $mavenUrl -OutFile $mavenZip

    # Extract Maven
    Write-Host "Extracting Maven..." -ForegroundColor Yellow
    Expand-Archive -Path $mavenZip -DestinationPath $env:TEMP -Force
    
    # Move extracted files
    $extractedDir = "$env:TEMP\apache-maven-$mavenVersion"
    Copy-Item -Path "$extractedDir\*" -Destination $mavenDir -Recurse -Force
    
    # Clean up
    Remove-Item $mavenZip -Force
    Remove-Item $extractedDir -Recurse -Force
    
    Write-Host "Maven installed successfully!" -ForegroundColor Green
    
    # Set environment variables
    $env:MAVEN_HOME = $mavenDir
    $env:PATH = "$mavenDir\bin;$env:PATH"
    
    # Set user environment variables
    [Environment]::SetEnvironmentVariable("MAVEN_HOME", $mavenDir, "User")
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
    if ($currentPath -notlike "*$mavenDir\bin*") {
        [Environment]::SetEnvironmentVariable("PATH", "$mavenDir\bin;$currentPath", "User")
    }
    
    Write-Host "Environment variables set!" -ForegroundColor Green
    
    # Test Maven
    Write-Host "Testing Maven installation..." -ForegroundColor Yellow
    & "$mavenDir\bin\mvn.cmd" -version
    
} catch {
    Write-Error "Failed to install Maven: $($_.Exception.Message)"
    Write-Host "Please install Maven manually from: https://maven.apache.org/download.cgi" -ForegroundColor Yellow
}
