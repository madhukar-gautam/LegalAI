@echo off
setlocal

set "MVNW_DIR=%~dp0"
set "MAVEN_VERSION=3.9.9"
set "MAVEN_HOME=%MVNW_DIR%.mvn\apache-maven-%MAVEN_VERSION%"
set "MAVEN_CMD=%MAVEN_HOME%\bin\mvn.cmd"

if not defined JAVA_HOME (
  for %%G in ("%ProgramFiles%\Eclipse Adoptium\jdk*" "%ProgramFiles%\Java\jdk*" "%ProgramFiles%\Microsoft\jdk*" "%ProgramFiles%\Amazon Corretto\jdk*") do (
    if exist "%%~G\bin\java.exe" set "JAVA_HOME=%%~G"
  )
)

if not defined JAVA_HOME (
  echo JAVA_HOME is not set and no JDK was auto-detected.
  echo Install JDK 17+ and set JAVA_HOME, then rerun this command.
  exit /b 1
)

if not exist "%MAVEN_CMD%" (
  echo Maven %MAVEN_VERSION% not found locally. Downloading...
  powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ErrorActionPreference='Stop';" ^
    "$version='3.9.9';" ^
    "$root=$env:MVNW_DIR;" ^
    "$wrapperDir=Join-Path $root '.mvn';" ^
    "New-Item -ItemType Directory -Force -Path $wrapperDir | Out-Null;" ^
    "$zipPath=Join-Path $wrapperDir ('apache-maven-' + $version + '-bin.zip');" ^
    "$downloadUrl='https://archive.apache.org/dist/maven/maven-3/' + $version + '/binaries/apache-maven-' + $version + '-bin.zip';" ^
    "Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath;" ^
    "Expand-Archive -Path $zipPath -DestinationPath $wrapperDir -Force;" ^
    "Remove-Item -Path $zipPath -Force;"

  if errorlevel 1 (
    echo Failed to bootstrap Maven.
    exit /b 1
  )
)

"%MAVEN_CMD%" %*
exit /b %ERRORLEVEL%
