# Java Runtime Configuration Guide for Cursor IDE

## Step 1: Find Your Java Installation

Since you mentioned JDK is downloaded, please check these common locations:

### Common Java Installation Paths:
- `C:\Program Files\Java\jdk-21.x.x\`
- `C:\Program Files\Eclipse Adoptium\jdk-21.x.x\`
- `C:\Program Files\Microsoft\jdk-21.x.x\`
- `C:\Users\[YourUsername]\AppData\Local\Programs\Eclipse Adoptium\jdk-21.x.x\`
- `C:\Users\[YourUsername]\AppData\Local\Microsoft\OpenJDK\jdk-21.x.x\`

### To find your Java installation:
1. Open File Explorer
2. Navigate to `C:\Program Files\Java\` and look for JDK folders
3. Or search for "jdk" in your C: drive
4. Look for a folder that contains `bin\java.exe`

## Step 2: Set Environment Variables

### Option A: Using System Properties (Recommended)
1. Press `Win + R`, type `sysdm.cpl`, press Enter
2. Click "Environment Variables"
3. Under "System Variables", click "New"
4. Variable name: `JAVA_HOME`
5. Variable value: `C:\Program Files\Java\jdk-21.x.x` (your actual JDK path)
6. Click OK

### Option B: Using PowerShell (Temporary)
```powershell
# Set JAVA_HOME (replace with your actual path)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21.x.x"

# Add Java to PATH
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

## Step 3: Add Java to PATH
1. In Environment Variables, find "Path" in System Variables
2. Click "Edit"
3. Click "New"
4. Add: `%JAVA_HOME%\bin`
5. Click OK on all dialogs

## Step 4: Verify Installation
Open a new Command Prompt or PowerShell and run:
```cmd
java -version
javac -version
echo %JAVA_HOME%
```

## Step 5: Configure Cursor IDE

### Method 1: VS Code Settings (Cursor uses VS Code settings)
1. Open Cursor IDE
2. Press `Ctrl + Shift + P`
3. Type "Preferences: Open Settings (JSON)"
4. Add the following configuration:

```json
{
    "java.home": "C:\\Program Files\\Java\\jdk-21.x.x",
    "java.configuration.runtimes": [
        {
            "name": "JavaSE-21",
            "path": "C:\\Program Files\\Java\\jdk-21.x.x"
        }
    ],
    "java.compile.nullAnalysis.mode": "automatic",
    "java.debug.settings.onBuildFailureProceed": true
}
```

### Method 2: Workspace Settings
Create `.vscode/settings.json` in your project root:

```json
{
    "java.home": "C:\\Program Files\\Java\\jdk-21.x.x",
    "java.configuration.runtimes": [
        {
            "name": "JavaSE-21",
            "path": "C:\\Program Files\\Java\\jdk-21.x.x"
        }
    ]
}
```

## Step 6: Install Java Extensions in Cursor
1. Open Extensions (Ctrl + Shift + X)
2. Install these extensions:
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - Maven for Java

## Step 7: Reload Cursor IDE
After configuration, restart Cursor IDE to apply all changes.

## Troubleshooting
- If Java is not found, ensure the path in JAVA_HOME is correct
- Make sure there are no spaces in the JDK installation path
- Restart your terminal/IDE after setting environment variables
- Check that the `bin` folder contains `java.exe` and `javac.exe`
