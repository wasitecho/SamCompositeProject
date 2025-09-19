@echo off
echo Setting up Java environment...

set JAVA_HOME=C:\Program Files\Java\jdk-17.0.12
set PATH=%JAVA_HOME%\bin;%PATH%

echo JAVA_HOME set to: %JAVA_HOME%
echo.

echo Testing Java installation...
java -version
echo.

echo Testing Maven with Java...
mvn -version
echo.

echo Java configuration complete!
echo You can now run: mvn clean compile
echo Or: mvn spring-boot:run
