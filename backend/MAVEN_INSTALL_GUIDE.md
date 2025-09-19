# Maven Installation Guide

## Quick Installation Options

### Option 1: Using Chocolatey (Recommended)
1. Install Chocolatey if not already installed:
   ```powershell
   Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
   ```

2. Install Maven:
   ```cmd
   choco install maven
   ```

### Option 2: Manual Installation
1. Download Maven from: https://maven.apache.org/download.cgi
2. Extract to: `C:\Program Files\Apache\maven`
3. Add to PATH: `C:\Program Files\Apache\maven\bin`

### Option 3: Using Scoop
1. Install Scoop:
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   irm get.scoop.sh | iex
   ```

2. Install Maven:
   ```cmd
   scoop install maven
   ```

## After Installation

1. Open a new Command Prompt or PowerShell
2. Run: `mvn -version`
3. If successful, run: `setup-environment.bat`

## Troubleshooting

- Make sure JAVA_HOME is set to your JDK installation
- Ensure Maven bin directory is in your PATH
- Restart your terminal after installation
