// ===== Service Worker 离线缓存 =====

// 🔢 缓存版本号（以后你只改这里）
const CACHE_VERSION = 'v1.0.0';

// 🧺 缓存名
const CACHE_NAME = `chat-app-cache-${CACHE_VERSION}`;

// 📦 需要缓存的资源
const ASSETS_TO_CACHE = [
    './',                 // 根路径
    './index.html',       // 你的主文件
    'https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=swap'
];

// 🟢 安装：预缓存
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    // 立刻进入激活态（不等旧 SW）
    self.skipWaiting();
});

// 🟡 激活：清理旧缓存
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

// 🔵 拦截请求：缓存优先，失败再走网络
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});