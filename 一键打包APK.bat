@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title 日记本 · 一键打包 APK
cd /d "%~dp0"

echo.
echo   ==========================================
echo     日记本 · Android APK 一键打包
echo   ==========================================
echo.

REM ============ 0. 检查用到的文件 ============
if not exist "package.json" (
  echo   [x] 当前目录没有 package.json
  echo       请先把安装包完整解压，然后在解压出来的目录里运行本脚本。
  pause & exit /b 1
)
if not exist "www\index.html" (
  echo   [x] 缺少 www\index.html（App 本体）
  echo       安装包可能没解压完整，请重新解压一次。
  pause & exit /b 1
)

REM ============ 1. 找 Node.js ============
set "NODE_EXE="
for /f "delims=" %%i in ('where node 2^>nul') do if not defined NODE_EXE set "NODE_EXE=%%i"
if not defined NODE_EXE if exist "%ProgramFiles%\nodejs\node.exe" set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
if not defined NODE_EXE if exist "%LOCALAPPDATA%\Programs\nodejs\node.exe" set "NODE_EXE=%LOCALAPPDATA%\Programs\nodejs\node.exe"
if not defined NODE_EXE (
  echo   [x] 没有找到 Node.js
  echo       请到 https://nodejs.org 下载 LTS 版本安装（一路下一步即可），
  echo       装完关掉这个窗口重新双击本脚本。
  pause & exit /b 1
)
for %%i in ("%NODE_EXE%") do set "NODE_DIR=%%~dpi"
set "PATH=%NODE_DIR%;%PATH%"
echo   [OK] Node.js: %NODE_EXE%

REM ============ 2. 找 JDK 17+ ============
set "JAVA_OK="
where java >nul 2>nul && set "JAVA_OK=1"
if not defined JAVA_OK if defined JAVA_HOME if exist "%JAVA_HOME%\bin\java.exe" set "JAVA_OK=1"
REM Android Studio 自带的 JDK（最常见的情况：没配 JAVA_HOME 也能用）
if not defined JAVA_OK if exist "%ProgramFiles%\Android\Android Studio\jbr\bin\java.exe" (
  set "JAVA_HOME=%ProgramFiles%\Android\Android Studio\jbr"
  set "PATH=%JAVA_HOME%\bin;%PATH%"
  set "JAVA_OK=1"
)
if not defined JAVA_OK if exist "%LOCALAPPDATA%\Programs\Android Studio\jbr\bin\java.exe" (
  set "JAVA_HOME=%LOCALAPPDATA%\Programs\Android Studio\jbr"
  set "PATH=%JAVA_HOME%\bin;%PATH%"
  set "JAVA_OK=1"
)
if not defined JAVA_OK (
  echo   [x] 没有找到 Java（JDK 17 或更新）
  echo       最简单的办法：安装 Android Studio，它自带 JDK。
  echo       https://developer.android.com/studio
  echo       或者单独装 Temurin JDK 17：https://adoptium.net
  pause & exit /b 1
)
if defined JAVA_HOME (echo   [OK] Java: %JAVA_HOME%) else (echo   [OK] Java: 已在 PATH 中)

REM ============ 3. 找 Android SDK ============
if "%ANDROID_HOME%"=="" if exist "%LOCALAPPDATA%\Android\Sdk" set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
if "%ANDROID_HOME%"=="" if exist "%USERPROFILE%\AppData\Local\Android\Sdk" set "ANDROID_HOME=%USERPROFILE%\AppData\Local\Android\Sdk"
if "%ANDROID_HOME%"=="" if exist "C:\Android\Sdk" set "ANDROID_HOME=C:\Android\Sdk"
if "%ANDROID_HOME%"=="" (
  echo   [x] 没有找到 Android SDK
  echo       请安装 Android Studio，并在首次启动时完成「Setup Wizard」
  echo       ^(它会自动下载 SDK^)。默认位置：
  echo       %LOCALAPPDATA%\Android\Sdk
  pause & exit /b 1
)
if not exist "%ANDROID_HOME%" (
  echo   [x] ANDROID_HOME 指向的目录不存在：%ANDROID_HOME%
  pause & exit /b 1
)
echo   [OK] Android SDK: %ANDROID_HOME%
echo.

REM ============ 4. 安装依赖 ============
echo   [1/5] 安装依赖（首次 1~3 分钟，需要联网）...
call npm install --no-audit --no-fund
if errorlevel 1 (
  echo.
  echo   [x] npm install 失败。
  echo       常见原因：网络问题。可以试试国内镜像后再重跑：
  echo         npm config set registry https://registry.npmmirror.com
  goto :fail
)

REM ============ 5. 生成 Android 工程 ============
echo   [2/5] 生成 Android 工程...
if not exist "android" (
  call npx cap add android
  if errorlevel 1 goto :fail
) else (
  echo        已存在 android 目录，跳过
)

echo   [3/5] 同步网页资源...
call npx cap sync android
if errorlevel 1 goto :fail

echo   [4/5] 应用安卓配置补丁（应用名 / 权限 / 图标）...
call node android-patch.mjs
if errorlevel 1 (
  echo   [!] 补丁执行失败，继续尝试编译...
)

REM ============ 6. 编译 ============
echo   [5/5] 编译 APK（首次会下载 Gradle，可能 5~15 分钟，请耐心等）...
cd android
call gradlew.bat assembleDebug
if errorlevel 1 (
  cd ..
  echo.
  echo   [x] 编译失败。常见原因：
  echo       1^) SDK 许可未接受：打开 Android Studio 一次，按提示同意
  echo       2^) 网络问题导致 Gradle 下载失败：重跑一次通常会好
  echo       3^) JDK 版本不对：需要 JDK 17 或更新
  goto :fail
)
cd ..

set "APK=android\app\build\outputs\apk\debug\app-debug.apk"
if not exist "%APK%" (
  echo   [x] 编译完成但没找到 apk，请检查上面的输出。
  goto :fail
)

echo.
echo   ==========================================
echo     ✓ 打包完成！
echo   ==========================================
for %%i in ("%APK%") do echo     APK: %%~fi
for %%i in ("%APK%") do echo     大小: %%~zi 字节
echo.
echo   接下来：
echo     1. 把上面那个 apk 传到手机（微信/QQ/数据线都行）
echo     2. 手机上点它安装，若被拦截就去「设置」允许安装未知应用
echo     3. 装好后桌面是「日记本」，离线可用，支持日记上锁
echo.
choice /c YN /n /m "  现在打开 APK 所在文件夹？(Y/N) "
if errorlevel 2 goto :done
explorer "android\app\build\outputs\apk\debug"
:done
echo.
pause & exit /b 0

:fail
echo.
echo   [x] 打包没有完成。把上面红字/错误信息截图发我，我来帮你定位。
echo.
pause & exit /b 1
