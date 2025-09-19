# MySQL Workbench Connection Setup

## 🎯 Goal
Connect MySQL Workbench to your local MySQL server for the Professional Plastics project.

## 📋 Prerequisites
- MySQL Server installed and running
- MySQL Workbench installed
- Database `plastics_demo` created

## 🚀 Step-by-Step Connection Setup

### Step 1: Start MySQL Server
First, make sure MySQL is running on your system:

**Option A: Command Line**
```cmd
net start mysql
```

**Option B: Windows Services**
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find "MySQL" service
4. Right-click → Start

**Option C: MySQL Command Line**
```cmd
mysql -u root -p
# Enter your password when prompted
# If successful, MySQL is running
```

### Step 2: Create Database (If Not Exists)
```sql
CREATE DATABASE plastics_demo;
USE plastics_demo;
```

### Step 3: Open MySQL Workbench
1. **Launch MySQL Workbench** from Start Menu
2. **Look for existing connections** in the main screen

### Step 4: Create New Connection
1. **Click the "+" icon** next to "MySQL Connections"
2. **Fill in connection details**:
   - **Connection Name**: `Local MySQL - Plastics Demo`
   - **Connection Method**: `Standard (TCP/IP)`
   - **Hostname**: `localhost` or `127.0.0.1`
   - **Port**: `3306`
   - **Username**: `root`
   - **Password**: `[Click "Store in Vault" and enter your MySQL password]`
3. **Click "Test Connection"**
4. **If successful, click "OK"**

### Step 5: Connect to Database
1. **Double-click** your new connection
2. **Enter password** if prompted
3. **You should see the MySQL Workbench interface**

### Step 6: Select Database
1. **In the Navigator panel** (left side)
2. **Expand "SCHEMAS"**
3. **Look for "plastics_demo"**
4. **If not visible, create it**:
   ```sql
   CREATE DATABASE plastics_demo;
   ```

## 🔧 Troubleshooting Common Issues

### Issue: "Cannot Connect to Database Server"
**Solutions:**
1. **Check if MySQL is running**:
   ```cmd
   net start mysql
   ```
2. **Check port 3306**:
   ```cmd
   netstat -an | findstr 3306
   ```
3. **Try different hostname**: `127.0.0.1` instead of `localhost`

### Issue: "Access Denied for User 'root'@'localhost'"
**Solutions:**
1. **Reset root password**:
   ```cmd
   mysql -u root -p
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
   ```
2. **Check if user exists**:
   ```sql
   SELECT User, Host FROM mysql.user;
   ```

### Issue: "Unknown Database 'plastics_demo'"
**Solution:**
```sql
CREATE DATABASE plastics_demo;
USE plastics_demo;
```

## 📊 Verify Connection
Once connected, you should see:
- **SCHEMAS panel** with `plastics_demo` database
- **Query editor** ready for SQL commands
- **Status bar** showing "Connected to MySQL"

## 🎯 Next Steps
1. **Create the database** if it doesn't exist
2. **Run your Spring Boot application**:
   ```cmd
   mvnw.cmd spring-boot:run
   ```
3. **Check MySQL Workbench** - you should see tables created automatically
4. **Test your API** at http://localhost:8080/api/products

## 🔍 Quick Test Commands
Once connected in MySQL Workbench, run these to verify:

```sql
-- Check if database exists
SHOW DATABASES;

-- Use the database
USE plastics_demo;

-- Check tables (after running Spring Boot app)
SHOW TABLES;

-- Check table structure
DESCRIBE product;
```

## 📞 Need Help?
- **MySQL not starting**: Check Windows Services
- **Connection refused**: Verify port 3306 is open
- **Access denied**: Reset MySQL root password
- **Database not found**: Create it manually in Workbench
