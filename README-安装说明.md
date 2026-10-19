# 日记本 · 装到 Android 手机上的三种方式

压缩包里已经有**一份完整的离线 App**（`www/`）和**一键打包脚本**。按省事程度排序：

> 📱 想先看长什么样？打开 `docs/界面截图/` 文件夹，里面有按「荣耀 Magic8 Pro」屏幕规格
> （1280×2800 / 19.5:9）仿真的 15 张真实界面截图：启动页、注册页、日记内页、手写图层、
> 图片大图、上锁键盘、解锁后、日历、设置、暗色主题、离线可用。

---

## 方式 A：不打包，10 秒装到手机（最快，功能完全一样）

1. 手机和电脑连同一个 Wi-Fi；
2. 电脑上运行本地服务器（`启动预览.bat`，或 `node tools/serve.mjs 4173`），
   终端会显示形如 `http://192.168.1.5:4173` 的地址；
3. 手机用 Chrome 或荣耀自带浏览器打开该地址；
4. 右上角菜单 → **「安装应用」/「添加到主屏幕」**；
5. 桌面出现「日记本」图标，点开即全屏 App，**断网也能用**。

> 差别：局域网 HTTP 下浏览器会禁用加密（WebCrypto），所以「日记上锁」在这种方式下不可用，
> App 里会明确提示原因与解法。要用上锁请走方式 B，或让页面走 HTTPS / 用电脑的 localhost 打开。

---

## 方式 B：用 GitHub 云构建出真正的 APK（不用装开发工具，推荐）

1. 注册 GitHub，新建一个空仓库（私有也行）；
2. 把本压缩包解压后的**所有文件**上传到仓库根目录
   （网页拖拽上传即可，根目录要能看到 `package.json`、`www/`、`.github/`）；
3. 仓库 → **Actions** → 左侧「构建 APK」→ **Run workflow**；
4. 等 3~6 分钟变绿，点进去在页面底部 **Artifacts** 下载 **日记本-APK**；
5. 解压得到 `app-debug.apk` → 传到手机 → 点击安装（允许「未知来源应用」）。

**要正式签名版**（可分享给别人、可上架）：先在电脑上执行一次
`keytool -genkey -v -keystore riji.keystore -alias riji -keyalg RSA -keysize 2048 -validity 10000`，
再用 `certutil -encode riji.keystore riji.txt` 取中间那段 base64，在仓库
**Settings → Secrets and variables → Actions** 加 `KEYSTORE_BASE64`、`KEYSTORE_PASSWORD`、
`KEY_ALIAS`、`KEY_PASSWORD` 四个 Secret，再跑一次即得 `app-release.apk`。

---

## 方式 C：本机用 Android Studio 打包

需要：**Node.js 18+**、**Android Studio**（自带 JDK 与 SDK，装完把 `ANDROID_HOME` 指到 SDK 目录）。

然后**双击 `一键打包APK.bat`**，它会依次完成：
安装依赖 → 生成 Android 工程 → 同步资源 → 打补丁 → 编译，最后告诉你 APK 在哪。

手动等价命令：

```bash
npm install
npx cap add android
npx cap sync android
node android-patch.mjs
cd android && gradlew.bat assembleDebug
```

也可以 `npx cap open android` 打开 Android Studio，点 ▶️ 直接装到连着的手机上。

---

## 常见问题

**gradlew 报找不到 SDK？** 设好 `ANDROID_HOME`（如 `C:\Users\你\AppData\Local\Android\Sdk`），
并在 Android Studio 里装 **SDK Platform 34** 与对应 **Build-Tools**。

**手机提示「应用未安装 / 已损坏」？** 先卸载手机上的旧版再装新包（签名不同会冲突）。

**提示禁止安装未知应用？** 设置 → 应用 → 浏览器/文件管理 → 允许安装未知应用。

**安装后名字是英文 / 图标没换？** 确认执行过 `node android-patch.mjs`。

**想换包名？** 改 `capacitor.config.json` 的 `appId`，删掉 `android/` 重新 `npx cap add android`。

**天气取不到？** 手机要联网并允许定位权限；也可在 设置 → 天气与位置 手动选城市。
