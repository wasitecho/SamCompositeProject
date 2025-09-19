# MySQL Setup Guide for Professional Plastics Backend

## 🎯 Goal
Connect your Spring Boot application to MySQL Workbench.

## 📋 Prerequisites
- MySQL Server installed and running
- MySQL Workbench installed
- Java 17 (already configured)

## 🚀 Step-by-Step Setup

### 1. Install MySQL Server
If not already installed:
1. Download MySQL Community Server: https://dev.mysql.com/downloads/mysql/
2. Install with default settings
3. Remember the root password you set during installation

### 2. Start MySQL Service
**Windows:**
```cmd
# Start MySQL service
net start mysql

# Or through Services:
# Press Win+R, type "services.msc"
# Find "MySQL" and start it
```

**Check if MySQL is running:**
```cmd
# Test connection
mysql -u root -p
# Enter your password when prompted
```

### 3. Create Database in MySQL Workbench
1. Open MySQL Workbench
2. Connect to your local MySQL server (localhost:3306)
3. Run this SQL to create the database:
```sql
CREATE DATABASE plastics_demo;
USE plastics_demo;
```

### 4. Configure Application Properties
Your `application.properties` is already configured for:
- **Database**: `plastics_demo`
- **Host**: `localhost:3306`
- **Username**: `root` (or set `DB_USERNAME` environment variable)
- **Password**: `password` (or set `DB_PASSWORD` environment variable)

### 5. Set Environment Variables (Optional)
If you want to use different credentials:
```cmd
set DB_USERNAME=your_username
set DB_PASSWORD=your_password
```

### 6. Test the Connection
```cmd
# Set Java environment
set JAVA_HOME=C:\Program Files\Java\jdk-17.0.12
set PATH=%JAVA_HOME%\bin;%PATH%

# Run the application
mvnw.cmd spring-boot:run
```

## 🔧 Troubleshooting

### MySQL Connection Issues
1. **Check if MySQL is running:**
   ```cmd
   net start mysql
   ```

2. **Check MySQL port:**
   ```cmd
   netstat -an | findstr 3306
   ```

3. **Test MySQL connection:**
   ```cmd
   mysql -u root -p -h localhost -P 3306
   ```

### Common Error Solutions

**Error: "Communications link failure"**
- MySQL service is not running
- Wrong port (should be 3306)
- Firewall blocking connection

**Error: "Access denied for user 'root'@'localhost'"**
- Wrong password
- User doesn't exist
- Check MySQL user privileges

**Error: "Unknown database 'plastics_demo'"**
- Database doesn't exist
- Create it in MySQL Workbench

## 📊 Database Schema
The application will automatically create tables based on your entities:
- `product` table (from Product.java entity)

## 🌐 Access Points
- **Application**: http://localhost:8080
- **API Endpoints**: 
  - GET http://localhost:8080/api/products
  - POST http://localhost:8080/api/products

## 🔄 Next Steps
1. Start MySQL service
2. Create `plastics_demo` database in MySQL Workbench
3. Run the application
4. Check MySQL Workbench to see the created tables
