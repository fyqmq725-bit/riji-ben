/* ==========================================================================
 * Android 工程补丁：在 Capacitor 生成 android/ 之后运行
 *   · 应用名设为「日记本」
 *   · 补上定位权限（天气自动定位用）
 *   · 用项目自带图标替换启动图标
 * 用法：node android-patch.mjs
 * ========================================================================== */

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const ANDROID = join(ROOT, 'android');
if (!existsSync(ANDROID)) {
  console.error('✗ 找不到 android/ 目录，请先执行：npx cap add android');
  process.exit(1);
}
const log = (s) => console.log('  · ' + s);

/* 1) 权限 */
const manifestPath = join(ANDROID, 'app', 'src', 'main', 'AndroidManifest.xml');
if (existsSync(manifestPath)) {
  let xml = readFileSync(manifestPath, 'utf8');
  const permissions = [
    '<uses-permission android:name="android.permission.INTERNET" />',
    '<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />',
    '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />',
  ];
  let added = 0;
  for (const p of permissions) {
    if (!xml.includes(p)) { xml = xml.replace(/<manifest([^>]*)>/, (m) => m + '\n    ' + p); added++; }
  }
  if (!xml.includes('requestLegacyExternalStorage')) {
    xml = xml.replace(/<application/, '<application\n        android:requestLegacyExternalStorage="true"');
  }
  writeFileSync(manifestPath, xml);
  log(added ? '已补充 ' + added + ' 条权限声明' : '权限声明已存在');
}

/* 2) 应用名 */
const stringsPath = join(ANDROID, 'app', 'src', 'main', 'res', 'values', 'strings.xml');
if (existsSync(stringsPath)) {
  let xml = readFileSync(stringsPath, 'utf8');
  xml = xml.replace(/<string name="app_name">[^<]*<\/string>/, '<string name="app_name">日记本</string>');
  xml = xml.replace(/<string name="title_activity_main">[^<]*<\/string>/, '<string name="title_activity_main">日记本</string>');
  writeFileSync(stringsPath, xml);
  log('应用名已设为「日记本」');
}

/* 3) 图标 */
const srcIcon = join(ROOT, 'www', 'assets', 'icons', 'icon-512.png');
if (existsSync(srcIcon)) {
  const dirs = ['mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi'];
  let replaced = 0;
  for (const d of dirs) {
    const target = join(ANDROID, 'app', 'src', 'main', 'res', d);
    if (!existsSync(target)) continue;
    for (const name of ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png']) {
      const file = join(target, name);
      if (existsSync(file)) { copyFileSync(srcIcon, file); replaced++; }
    }
  }
  if (replaced) log('启动图标已替换（' + replaced + ' 个文件；想要多尺寸精细图标可运行 npx @capacitor/assets generate）');
}

console.log('');
console.log('  ✓ Android 工程补丁完成');
console.log('    接着：cd android && gradlew.bat assembleDebug');
console.log('    产物：android/app/build/outputs/apk/debug/app-debug.apk');
