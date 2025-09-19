# MySQL Installation Guide for Windows

## 🎯 Quick Installation Options

### Option 1: MySQL Installer (Recommended)
1. **Download**: https://dev.mysql.com/downloads/installer/
2. **Choose**: MySQL Installer for Windows
3. **Select**: MySQL Community Server
4. **Install**: Follow the setup wizard
5. **Remember**: The root password you set during installation

### Option 2: Using Chocolatey
```powershell
# Install Chocolatey if not already installed
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install MySQL
choco install mysql
```

### Option 3: Using Scoop
```powershell
# Install Scoop if not already installed
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Install MySQL
scoop install mysql
```

## 🔧 After Installation

### 1. Start MySQL Service
```cmd
net start mysql
```

### 2. Test Connection
```cmd
mysql -u root -p
# Enter your password when prompted
```

### 3. Create Database
```sql
CREATE DATABASE plastics_demo;
USE plastics_demo;
```

### 4. Run Setup Script
```cmd
setup-mysql.bat
```

## 🚀 Quick Start Commands

```cmd
# 1. Start MySQL
net start mysql

# 2. Create database
mysql -u root -p -e "CREATE DATABASE plastics_demo;"

# 3. Set Java environment
set JAVA_HOME=C:\Program Files\Java\jdk-17.0.12
set PATH=%JAVA_HOME%\bin;%PATH%

# 4. Run application
mvnw.cmd spring-boot:run
```

## 🔍 Troubleshooting

### MySQL Service Won't Start
1. Check if port 3306 is in use:
   ```cmd
   netstat -an | findstr 3306
   ```
2. Check Windows Services:
   - Press `Win + R`, type `services.msc`
   - Find "MySQL" service and start it

### Connection Refused
1. Verify MySQL is running: `net start mysql`
2. Check firewall settings
3. Verify port 3306 is open

### Access Denied
1. Reset root password if needed
2. Check user privileges in MySQL Workbench

## 📊 MySQL Workbench Setup

1. **Open MySQL Workbench**
2. **Create New Connection**:
   - Connection Name: `Local MySQL`
   - Hostname: `localhost`
   - Port: `3306`
   - Username: `root`
   - Password: `[your password]`
3. **Test Connection**
4. **Create Database**:
   ```sql
   CREATE DATABASE plastics_demo;
   ```

## ✅ Verification

After setup, you should be able to:
- Connect to MySQL from command line
- See `plastics_demo` database in MySQL Workbench
- Run your Spring Boot application without database errors
