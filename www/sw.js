/* ==========================================================================
 * 日记本 · Service Worker（离线优先）
 *  · 预缓存应用外壳与全部模块，离线也能正常使用
 *  · 页面导航：网络优先，失败回落到缓存
 *  · 静态资源：缓存优先，后台更新
 * ========================================================================== */

// 打包时 tools/build-app.mjs 会把它替换成 riji-<版本>-<构建时间>，每次构建都不同，
// 这样浏览器一定会拉新资源；源码调试时用这个值即可。
const VERSION = 'riji-1.0.1-20261019035553';
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/tokens.css',
  './css/app.css',
  './css/panel.css',
  './js/app.js',
  './js/core/utils.js',
  './js/core/crypto.js',
  './js/core/storage.js',
  './js/core/image-engine.js',
  './js/core/font-subset.js',
  './js/ui/modal.js',
  './js/ui/flipbook.js',
  './js/ui/sheet.js',
  './js/ui/calendar.js',
  './js/ui/editor.js',
  './js/ui/drawing.js',
  './js/ui/sketch.js',
  './js/ui/settings.js',
  './js/ui/export-ui.js',
  './js/ui/diagnostics.js',
  './js/features/ai.js',
  './js/features/audio.js',
  './js/features/export.js',
  './js/features/handwriting.js',
  './js/features/weather.js',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/icon-apple-180.png',
];

// 中文字体较大，按需缓存（首次导出 PDF 时下载）
const OPTIONAL_ASSETS = ['./assets/fonts/pdf-cjk.ttf'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await cache.addAll(SHELL_ASSETS.map((u) => new Request(u, { cache: 'reload' }))).catch((err) => {
      console.warn('[SW] 部分外壳资源预缓存失败：', err);
    });
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // 天气 API：网络优先，失败给缓存（离线时回落到最近一次结果）
  if (url.hostname.includes('open-meteo.com') || url.hostname.includes('geocoding-api')) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match(request);
        if (cached) return cached;
        return new Response(JSON.stringify({ error: 'offline' }), {
          status: 503, headers: { 'Content-Type': 'application/json' },
        });
      }
    })());
    return;
  }

  // 外部请求（云端 AI 等）不拦截
  if (url.origin !== self.location.origin) return;

  // 页面导航
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        return await fetch(request);
      } catch {
        const cached = await caches.match('./index.html') || await caches.match('./');
        return cached || new Response('离线且没有缓存', { status: 503, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
      }
    })());
    return;
  }

  // 静态资源：缓存优先 + 后台更新
  event.respondWith((async () => {
    const cached = await caches.match(request);
    const isFont = url.pathname.includes('/fonts/');
    if (cached && !isFont) {
      fetchAndCache(request).catch(() => {});
      return cached;
    }
    if (cached) return cached;
    try {
      return await fetchAndCache(request);
    } catch {
      if (OPTIONAL_ASSETS.some((a) => url.pathname.endsWith(a.replace('./', '/')))) {
        return new Response('字体未缓存', { status: 503 });
      }
      return new Response('离线', { status: 503, headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
    }
  })());
});

async function fetchAndCache(request) {
  const response = await fetch(request);
  if (response && response.ok && response.type === 'basic') {
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

// 允许页面主动要求跳过等待 / 清理缓存
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
  if (event.data === 'clearCache') {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))));
  }
});
