# Quick Start Guide - Professional Plastics Backend

## ✅ Current Status
- ✅ Java 17 is installed and working
- ✅ Project is configured for Java 17
- ✅ Cursor IDE is configured
- ⚠️ Maven needs to be installed

## 🚀 How to Run the Project

### Option 1: Install Maven (Recommended)
1. **Download Maven**: https://maven.apache.org/download.cgi
2. **Extract to**: `C:\Program Files\Apache\maven`
3. **Add to PATH**: `C:\Program Files\Apache\maven\bin`
4. **Run**: `mvn spring-boot:run`

### Option 2: Use Maven Wrapper (Already Created)
1. **Set Java environment**:
   ```cmd
   set JAVA_HOME=C:\Program Files\Java\jdk-17.0.12
   set PATH=%JAVA_HOME%\bin;%PATH%
   ```
2. **Run project**:
   ```cmd
   mvnw.cmd spring-boot:run
   ```

### Option 3: Use the Batch File
1. **Double-click**: `run-project.bat`
2. **Follow the prompts**

## 🔧 Manual Compilation (If Maven fails)
```cmd
# Set Java environment
set JAVA_HOME=C:\Program Files\Java\jdk-17.0.12
set PATH=%JAVA_HOME%\bin;%PATH%

# Compile manually
javac -cp "src/main/java" -d target/classes src/main/java/com/professionalplastics/*.java

# Run the application
java -cp "target/classes" com.professionalplastics.PlasticsDemoApplication
```

## 🌐 Access the Application
Once running, visit: http://localhost:8080

## 📁 Project Structure
```
backend/
├── src/main/java/com/professionalplastics/
│   ├── PlasticsDemoApplication.java    # Main Spring Boot app
│   ├── controller/ProductController.java
│   ├── entity/Product.java
│   ├── repository/ProductRepository.java
│   └── service/ProductService.java
├── src/main/resources/
│   ├── application.properties
│   └── data.sql
├── pom.xml                            # Maven configuration
├── mvnw.cmd                          # Maven wrapper
└── run-project.bat                   # Easy run script
```

## 🆘 Troubleshooting
- **Java not found**: Run `setup-java.bat`
- **Maven not found**: Install Maven or use `mvnw.cmd`
- **Port 8080 in use**: Change port in `application.properties`
- **Database errors**: Check MySQL connection settings

## 📞 Need Help?
1. Check the logs in the terminal
2. Verify Java installation: `java -version`
3. Verify Maven: `mvn -version` or `mvnw.cmd -version`
4. Check database connection settings
